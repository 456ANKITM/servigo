import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Job from "../models/Job.js";
import { createNotification } from "../utils/notification.js";
import Agreement from "../models/Agreement.js";
import streamifier from "streamifier";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {};

    // ✅ Basic fields
    const allowedFields = ["name", "bio", "professionalTitle"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.body.city) {
      updates.city = req.body.city;
    }

    // ✅ Experience
    if (req.body.experienceYears !== undefined) {
      const exp = Number(req.body.experienceYears);
      if (!isNaN(exp) && exp >= 0) {
        updates.experienceYears = exp;
      } else {
        return res.status(400).json({
          message: "Invalid experience value",
        });
      }
    }

    // ✅ Skills
    if (req.body.skills !== undefined) {
      let parsedSkills = [];

      try {
        if (typeof req.body.skills === "string") {
          try {
            const parsed = JSON.parse(req.body.skills);
            parsedSkills = Array.isArray(parsed) ? parsed : [req.body.skills];
          } catch {
            parsedSkills = req.body.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          }
        }

        if (Array.isArray(req.body.skills)) {
          parsedSkills = req.body.skills;
        }

        updates.skills = parsedSkills
          .map((s) => s.toLowerCase().trim())
          .filter(Boolean);
      } catch (err) {
        return res.status(400).json({
          message: "Invalid skills format",
        });
      }
    }

    // ✅ Availability
    if (req.body.availability !== undefined) {
      const valid = ["available", "not-available"];
      if (!valid.includes(req.body.availability)) {
        return res.status(400).json({
          message: "Invalid availability",
        });
      }
      updates.availability = req.body.availability;
    }

    // ✅ Profile Image (NO DISK STORAGE)
    if (req.files?.profileImage) {
      const file = req.files.profileImage[0];

      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          message: "Only image files are allowed",
        });
      }

      const uploadFromBuffer = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "profiles" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      const result = await uploadFromBuffer(file.buffer);
      updates.profileImage = result.secure_url;
    } // ✅ FIXED: closing brace added here

    // ✅ Update only provided fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while updating profile",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return res.json({ success: false, message: "Server Error" });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { query = "" } = req.query;

    const clientCoords = req.user?.geoLocation?.coordinates;

    const q = query.toLowerCase();

    // ✅ STEP 1: ONLY FETCH MATCHED USERS (NOT ALL USERS)
    let filter = {
      role: "worker",
    };

    if (query) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { professionalTitle: { $regex: q, $options: "i" } },
        { bio: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select(
        "name email profileImage ratingsAverage totalReviews skills city bio professionalTitle completedJobs geoLocation"
      )
      .limit(50); // safety cap before scoring

    // ---------------- DISTANCE FUNCTION ----------------
    const getDistanceInKm = (coords1, coords2) => {
      if (!coords1 || !coords2) return null;

      const [lng1, lat1] = coords1;
      const [lng2, lat2] = coords2;

      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // ---------------- STEP 2: SCORING ----------------
    const scoredUsers = users.map((user) => {
      let score = 0;

      const name = user.name?.toLowerCase() || "";
      const title = user.professionalTitle?.toLowerCase() || "";
      const bio = user.bio?.toLowerCase() || "";
      const skills = user.skills?.map((s) => s.toLowerCase()) || [];

      // 🔥 TEXT MATCH BOOST
      if (query) {
        if (name.includes(q)) score += 15;
        if (title.includes(q)) score += 20;
        if (bio.includes(q)) score += 10;

        skills.forEach((s) => {
          if (s.includes(q)) score += 15;
        });
      }

      // ⭐ RATING
      score += (user.ratingsAverage || 0) * 5;
      score += Math.min(user.totalReviews || 0, 10);

      // 💼 EXPERIENCE
      score += (user.completedJobs?.length || 0) * 2;

      // 📍 LOCATION BOOST (VERY IMPORTANT)
      let distance = null;

      if (clientCoords && user.geoLocation?.coordinates) {
        distance = getDistanceInKm(
          clientCoords,
          user.geoLocation.coordinates
        );

        if (distance !== null) {
          if (distance <= 2) score += 40;
          else if (distance <= 5) score += 30;
          else if (distance <= 10) score += 20;
          else if (distance <= 20) score += 10;
          else score += 2;
        }
      }

      return {
        ...user._doc,
        score,
        distance,
      };
    });

    // ---------------- STEP 3: SORT + LIMIT ----------------
    const sortedUsers = scoredUsers
      .sort((a, b) => {
        if (b.score === a.score) {
          // secondary priority: closer first
          return (a.distance || 9999) - (b.distance || 9999);
        }
        return b.score - a.score;
      })
      .slice(0, 20); // ✅ ONLY TOP 20 USERS

    return res.json({
      success: true,
      total: sortedUsers.length,
      users: sortedUsers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select("-password")
      .populate("reviews.reviewer", "name profileImage");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: "Server error" });
  }
};

export const rateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rating } = req.body;
    const reviewerId = req.user._id;

    const user = await User.findById(userId);
    const reviewer = await User.findById(reviewerId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (userId.toString() === reviewerId.toString()) {
      return res.json({
        success: false,
        message: "You cannot rate yourself",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Rating must be between 1 to 5",
      });
    }

    const alreadyRated = user.ratings.find(
      (r) => r.userId.toString() === reviewerId.toString(),
    );

    if (alreadyRated) {
      return res.json({
        success: false,
        message: "You have already rated this user",
      });
    }

    user.ratings.push({
      userId: reviewerId,
      rating,
    });

    const numberOfRatings = user.ratings.length;

    const total = user.ratings.reduce((acc, item) => {
      return acc + item.rating;
    }, 0); // ✅ FIXED

    user.ratingsAverage = total / numberOfRatings;

    await createNotification({
      userId: userId,
      title: "Rating",
      message: `${reviewer.name} has added a rating of ${rating} and now your current average rating is ${user.ratingsAverage}`,
    });

    await user.save();

    return res.json({
      success: true,
      message: "Rating submitted successfully",
      ratingsAverage: user.ratingsAverage,
    });
  } catch (error) {
    console.error("Rate User Error:", error);

    return res.json({
      success: false,
      message: "Server Error",
    });
  }
};

export const addReview = async (req, res) => {
  try {
    const { userId } = req.params;
    const { comment } = req.body;
    const reviewerId = req.user._id;

    const reviewer = await User.findById(reviewerId);

    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (userId.toString() === reviewerId.toString()) {
      return res.json({
        success: false,
        message: "You can not review yourself",
      });
    }

    const alreadyReviewed = user.reviews.find(
      (r) => r.reviewer.toString() === reviewerId.toString(),
    );
    if (alreadyReviewed) {
      return res.json({ success: false, message: "You have already reviewed" });
    }
    user.reviews.push({
      reviewer: reviewerId,
      comment,
    });

    user.totalReviews = user.reviews.length;

    await createNotification({
      userId: userId,
      title: "New Review",
      message: `${reviewer.name} has reviewed on your profile`,
      type: "SYSTEM",
    });

    await user.save();

    return res.json({
      success: true,
      message: "Reviews added successfully",
      totalReviews: user.totalReviews,
    });
  } catch (error) {
    return res.json({ success: false, message: "Server Error" });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("reviews").populate({
      path: "reviews.reviewer",
      select: "name profileImage",
    });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const sortedReviews = user.reviews.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    return res.json({
      success: true,
      total: sortedReviews.length,
      reviews: sortedReviews,
    });
  } catch (error) {
    return res.json({ success: false, message: "server error" });
  }
};

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const job = await Job.findById(jobId);

    if (!job) {
      return res.json({ success: false, message: "Job Not found" });
    }
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const alreadySaved = user.savedJobs.some(
      (j) => j.jobId.toString() === jobId.toString(),
    );
    if (alreadySaved) {
      return res.json({ success: false, message: "Job is already saved" });
    }
    user.savedJobs.push({
      jobId: jobId,
      appliedAt: new Date(),
    });
    await user.save();
    return res.json({ success: true, message: "Job Saved Successfully" });
  } catch (error) {
    return res.json({ success: false, message: "Server Error" });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("savedJobs.jobId");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const jobs = user.savedJobs.map((item) => ({
      ...item.jobId._doc,
      savedAt: item.appliedAt,
    }));

    return res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("appliedJobs.jobId");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const jobs = user.appliedJobs.map((item) => ({
      ...item.jobId._doc,
      savedAt: item.savedAt,
    }));

    return res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCurrentJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: "currentJobs.jobId",
      model: "Job",
    });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const jobs = user.currentJobs
      .filter((item) => item.jobId)
      .map((item) => ({
        ...item.jobId._doc,
      }));

    return res.json({ success: true, jobs });
  } catch (error) {
    return res.json({ success: false, message: "Server Error", error });
  }
};

export const getCompletedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: "completedJobs.jobId",
      model: "Job",
    });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const jobs = user.completedJobs
      .filter((item) => item.jobId)
      .map((item) => ({
        ...item.jobId._doc,
      }));
    return res.json({ success: true, jobs });
  } catch (error) {
    return res.json({ success: false, message: "Server Error", error });
  }
};


export const getWorkerByService = async (req, res) => {
  try {
    const { service } = req.query;
    if (!service) {
      return res
        .status(400)
        .json({ success: false, message: "Service Query is required" });
    }
    const workers = await User.aggregate([
      {
        $match: {
          role: "worker",
          services: service,
          availability: "available",
        },
      },
      {
        $addFields: {
          completedJobsCount: { $size: "$completedJobs" },
          reviewCount: "$totalReviews",
        },
      },

      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$ratingsAverage", 3] },
              { $multiply: ["$reviewCount", 1] },
              { $multiply: ["$completedJobsCount", 2] },
            ],
          },
        },
      },

      {
        $sort: {
          score: -1,
        },
      },

      {
        $limit: 20,
      },

      {
        $project: {
          password: 0,
          notifications: 0,
        },
      },
    ]);

    res.status(200).json({ success: true, data: workers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server Error" });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        geoLocation: {
          type: "Point",
          coordinates: [longitude, latitude], // ✅ correct order
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Location Updated Successfully",
      user: updatedUser, // ✅ FIXED
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update the location",
    });
  }
};

export const getUserAgreements = async (req, res) => {
  console.log("The request to get agreements is comming")
  try {
    const userId = req.user._id;
    const role = req.user.role;
    let filter = {}
    if(role === "client"){
      filter.clientId = userId;
    } else if(role === "worker"){
      filter.workerId = userId
    } else {
      return res.status(400).json({
        success:false,
        message:"Invalid User role"
      })
    }

    console.log(filter)

    const agreements = await Agreement.find(filter)
    .populate("jobId", "title description category location status budget skills hiredWorker ")
    .populate("clientId", "name profileImage")
    .populate("workerId", "name profileImage")
    .sort({createdAt:-1})
    

    return res.status(200).json({success:true, total:agreements.length, agreements})
  } catch (error) {
    return res.status(500).json({success:false, message:"Server Error"})
  }
}