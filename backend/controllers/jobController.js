import Job from "../models/Job.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { createNotification } from "../utils/notification.js";
import Agreement from "../models/Agreement.js";


export const addJob = async (req, res) => {
  try {
    console.log(req.body)
    if (req.user.role !== "client") {
      return res.status(403).json({
        success: false,
        message: "Only Client Can post the job",
      });
    }

    const clientId = req.user._id;
    const {
      title,
      description,
      category,
      location,
      budgetType,
      budgetAmount,
      skills,
    } = req.body;

    // validation updated (NO location anymore)
    if (!title || !description || !category || !location || !budgetType) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, category, location and budgetType are required",
      });
    }

    const parsedSkills = Array.isArray(skills)
      ? skills
      : skills
        ? [skills]
        : [];


    const newJob = await Job.create({
      title,
      description,
      category,
      location,
      client: clientId,
      skills: parsedSkills,
      budget: {
        type: budgetType,
        amount: budgetAmount || 0,
      },
      status: "open",
    });

    return res.status(201).json({
      success: true,
      message: "Job Created Successfully",
      job: newJob,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    return res.json({ success: true, jobs });
  } catch (error) {
    return res.json({ success: false, message: "Server Error" });
  }
};

export const getJobsByClient = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.json({ success: false, message: "You are not a client" });
    }

    const clientId = req.user._id;

    const jobs = await Job.find({ client: clientId }).sort({
      createdAt: -1,
    });

    return res.json({ success: true, jobs });
  } catch (error) {
    return res.json({ success: false, message: "Server Error" });
  }
};


export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.json({ success: false, message: "Job not found" });
    }

    if (job.client.toString() !== req.user._id.toString()) {
      return res.json({
        success: false,
        message: "You are not authorized to delete the job",
      });
    }

    await Job.findByIdAndDelete(jobId);

    return res.json({
      success: true,
      message: "Job Deleted Successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: "Server Error" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId).populate("client", "name email");

    if (!job) {
      return res.json({ success: false, message: "Job not found" });
    }

    return res.json({ success: true, job });
  } catch (error) {
    return res.json({ success: false, message: "Server Error" });
  }
};

export const searchJobs = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const jobs = await Job.find({ status: "open" });

    const keyword = search.toLowerCase().trim();

    const scoredJobs = jobs.map((job) => {
      let score = 0;

      const title = job.title?.toLowerCase() || "";
      const description = job.description?.toLowerCase() || "";
      const category = job.category?.toLowerCase() || "";
      const location = job.location?.toLowerCase() || "";
      const skills = job.skills?.map((s) => s.toLowerCase()) || [];

      // Title match (highest weight)
      if (title.includes(keyword)) score += 5;

      // Category match
      if (category.includes(keyword)) score += 4;

      // Skills match
      skills.forEach((skill) => {
        if (skill.includes(keyword)) score += 3;
      });

      // Description match
      if (description.includes(keyword)) score += 2;

      // Location match
      if (location.includes(keyword)) score += 1;

      return {
        ...job._doc,
        score,
      };
    });

    const sortedJobs = scoredJobs
      .filter((job) => job.score > 0)
      .sort((a, b) => b.score - a.score);

    return res.json({
      success: true,
      jobs: sortedJobs,
    });
  } catch (error) {
    console.error("Search Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const easyApplyJob = async (req, res) => {
  try {
    console.log("Request is comming");
    const { jobId } = req.params;
    const userId = req.user._id;
    const job = await Job.findById(jobId);
    const user = await User.findById(userId);
    if (!job) {
      return res.json({ success: false, message: "Job not found" });
    }
    if (job.client.toString() === userId.toString()) {
      return res.json({
        success: false,
        message: "You can not apply to your job",
      });
    }
    if (job.appliedWorkers.some((id) => id.toString() === userId.toString())) {
      return res.json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    job.appliedWorkers.push(userId);

    user.appliedJobs.push({
      jobId: new mongoose.Types.ObjectId(jobId),
      appliedAt: new Date(),
    });

    user.markModified("appliedJobs");
    await createNotification({
      userId: job.client,
      title: "New Application",
      message: `${user.name} applied to your job for ${job.title}`,
      type: "JOB_APPLICATION",
    });

    await job.save();
    await user.save();

    return res.json({ success: true, message: "Applied Successfully" });
  } catch (error) {
    return res.json({ success: false, message: "Server Error", error });
  }
};

export const getAppliedWorkersRanked = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId)
      .populate({
        path: "appliedWorkers",
        select:
          "name email profileImage ratingsAverage totalReviews skills city bio professionalTitle completedJobs geoLocation",
      })
      .populate({
        path: "client",
        select: "geoLocation city",
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const jobTitle = job.title?.toLowerCase() || "";
    const jobDescription = job.description?.toLowerCase() || "";
    const jobSkills = job.skills?.map((s) => s.toLowerCase()) || [];

    // ✅ CLIENT LOCATION (MAIN FIX)
    const clientCoords = job.client?.geoLocation?.coordinates;

    let workers = job.appliedWorkers || [];

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

    const scoredWorkers = workers.map((worker) => {
      let score = 0;

      const title = worker.professionalTitle?.toLowerCase() || "";
      const bio = worker.bio?.toLowerCase() || "";
      const skills = worker.skills?.map((s) => s.toLowerCase()) || [];
      const city = worker.city?.toLowerCase() || "";

      // ⭐ Rating (20%)
      score += (worker.ratingsAverage || 0) * 4;
      score += Math.min(worker.totalReviews || 0, 10);

      // 🧠 Skill match (20%)
      let skillMatch = 0;
      skills.forEach((skill) => {
        if (jobSkills.includes(skill)) {
          skillMatch += 5;
        }
      });
      score += skillMatch;

      // 📊 Experience (10%)
      score += (worker.completedJobs?.length || 0) * 2;

      // 📝 Text match (10%)
      if (title && jobTitle.includes(title)) {
        score += 8;
      }

      const bioWords = bio.split(" ");
      const jobWords = jobDescription.split(" ");

      const bioMatchCount = bioWords.filter((w) =>
        jobWords.includes(w)
      ).length;

      score += bioMatchCount * 0.3;

      // 📍 LOCATION SCORE (CLIENT BASED - FIXED)
      let distance = null;

      if (clientCoords && worker.geoLocation?.coordinates) {
        distance = getDistanceInKm(
          clientCoords,
          worker.geoLocation.coordinates
        );

        if (distance !== null) {
          if (distance <= 2) score += 40;
          else if (distance <= 5) score += 30;
          else if (distance <= 10) score += 20;
          else if (distance <= 20) score += 10;
          else score += 2;
        }
      } else if (city && job.client?.city) {
        // fallback if geo missing
        if (city.toLowerCase() === job.client.city.toLowerCase()) {
          score += 15;
        }
      }

      return {
        ...worker._doc,
        score,
        distance,
      };
    });

    const sortedWorkers = scoredWorkers.sort((a, b) => b.score - a.score);

    return res.json({
      success: true,
      total: sortedWorkers.length,
      workers: sortedWorkers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const hireWorker = async (req, res) => {
  
  try {
    const { jobId, userId } = req.params;
    const clientId = req.user._id;
    const job = await Job.findById(jobId);
    const worker = await User.findById(userId);
    if (!job) {
      return res.json({ success: false, message: "Job not found" });
    }
    if (!worker) {
      return res.json({ success: false, message: "Worker not found" });
    }
    if (job.client.toString() !== clientId.toString()) {
      return res.json({ success: false, message: "Not Authorized" });
    }
    if (job.status !== "open") {
      return res.json({ success: false, message: "Job already hired" });
    }
    const alreadyHired =
      job.hiredWorker && job.hiredWorker.toString() === userId;

    if (alreadyHired) {
      return res.json({
        success: false,
        message: "This worker is already hired",
      });
    }

    // ✅ Check if job already has someone else hired
    if (job.hiredWorker) {
      return res.json({
        success: false,
        message: "Another worker is already hired",
      });
    }


    job.hiredWorker = userId;
    job.status = "in-progress";

    worker.currentJobs.push({
      jobId: job._id,
      appliedAt: new Date(),
    });

      const agreement = await Agreement.create({
      jobId: job._id,
      clientId: clientId,
      workerId: userId,
    });

    await createNotification({
      userId: userId,
      title: "You Got Hired!",
      message: `You have been selected for a job as ${job.title}`,
      type: "JOB_HIRED",
    });

    await job.save();
    await worker.save();
  
    return res.json({ success: true, message: "Worker hired Successfully", agreement });
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: "Server Error"});
  }
};

export const markJobCompleted = async (req, res) => {
  try {
    const {jobId} = req.params;
    const userId = req.user._id;

    const job = await Job.findById(jobId);
    if(!job) {
      return res.status(404).json({success:false, message:"Job not found"})
    }
    if(job.client.toString() !== userId.toString()) {
      return res.status(403).json({success:false, message:"Only Client Can mark job as completed"})
    }

    if(job.status === "completed") {
      return res.json({success:false, message:"Job already maked as completed"})
    }
    
    job.status = "completed";

    await job.save();
    res.status(200).json({success:true, message:"Job Marked as completed"})
  } catch (error) {
    res.status(500).json({success:false, message:"Server Error"})
  }
}

export const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if(!user || user.role !== "worker") {
      return res.status(403).json({success:false, message:"Only Workers can access this"})
    }

    const workerTitle = user.professionalTitle?.toLowerCase() || "";
    const workerBio = user.bio?.toLowerCase() || "";
    const workerSkills = user.skills?.map((s)=>s.toLowerCase()) || [];
    const workerServices = user.services?.map((s)=>s.toLowerCase()) || [];
    const workerCoords = user.geoLocation?.coordinates;

    // Fetch all open Jobs 
    const jobs = await Job.find({status:"open"}).populate("client");

    // Distance Function 
    const getDistanceInKm = (coords1, coords2) => {
      if(!coords1 || !coords2) return null;
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

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

      return R * c;
    }

    // Scoring 

    const scoredJobs = jobs.map((job) =>{
      let score = 0;
 
      const jobTitle = job.title?.toLowerCase() || "";
      const jobDesc = job.description?.toLowerCase() || "";
      const jobSkills = job.skills?.map((s)=>s.toLowerCase()) || [];
      const jobCategory = job.category?.toLowerCase() || ""

      // 1. Skills Match
      jobSkills.forEach((skill)=>{
        if(workerSkills.includes(skill)) {
          score += 15;
        }
      })

      // 2. Service Match  
      if(workerServices.includes(jobCategory)) {
        score += 25;
      }

      // 3. Title Match 
      if (
        workerTitle && 
        (jobTitle.includes(workerTitle) || 
        workerTitle.includes(jobTitle  ))
      ) {
        score += 10;
      }


      // 4. Bio text Match 
      const bioWords = workerBio.split(" ")
      const jobWords = jobDesc.split(" ")

      const matches = bioWords.filter((w)=>jobWords.includes(w)).length;
      score += matches * 0.5;

      // 5. Location Match 
        let distance = null;

      if(workerCoords && job.client?.geoLocation?.coordinates) {
        distance = getDistanceInKm(
          workerCoords, job.client.geoLocation.coordinates
        );
        if(distance !== null) {
          if(distance <= 2) score += 30;
          else if (distance <= 5 ) score += 20;
          else if (distance <= 10) score += 10;
          else score += 2
        }
      }

      return {
        ...job._doc,
        score,
        distance
      }
    })

      // Sort 

      const sortedJobs = scoredJobs.sort((a, b)=>{
        if(b.score === a.score){
          return (a.distance || 9999) - (b.distance  || 9999)
        }
        return b.score - a.score
      })

      return res.json({success:true, total:sortedJobs.length, jobs:sortedJobs});
  } catch (error) {
     return res.status(500).json({success:false, message:'Server Error'})
  }
}






