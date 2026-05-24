import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comment: String,
  },
  { timestamps: true },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    services: {
      type: [String],
      enum: [
          "Plumbing",
        "Electrician",
        "Driver",
        "Carpenter",
        "Painter",
        "Cleaner",
        "Home Repair",
        "Appliance Repair",
        "Mechanic",
        "Tutor",
        "Delivery",
        "Gardener",
        "Cook",
        "Tech Support",
        "Photographer",
      ],
      default: [],
      validate:{
        validator: function (v) {
          if(this.role === "worker"){
            return Array.isArray(v) && v.length > 0
          }
          return true;
        },
        message:"At least one service is required for workers"
      }
    },
    city: {
      type: String,
      trim: true,
    },
    geoLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    role: {
      type: String,
      enum: ["client", "worker", "admin"],
      default: "client",
    },
    profileImage: String,
    bio: String,
    professionalTitle: String,
    skills:[String],
    availability: {
      type: String,
      enum: ["available", "not-available"],
      default: "available",
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
    reviews: [reviewSchema],

    isVerified: {
      type: Boolean,
      default: false,
    },

    notifications: [
      {
        message: String,
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
    appliedJobs: [
      {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
        appliedAt: { type: Date, default: Date.now },
      },
    ],
    currentJobs: [
      {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
        appliedAt: { type: Date, default: Date.now },
        agreementId: {type:mongoose.Schema.Types.ObjectId, ref:"Agreement"}
      },
    ],
    completedJobs: [
      {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
        appliedAt: { type: Date, default: Date.now },
      },
    ],
    savedJobs: [
      {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
        appliedAt: { type: Date, default: Date.now },
      },
    ],
  },

  { timestamps: true },
);

userSchema.index({ "geoLocation": "2dsphere" });

const User = mongoose.model("User", userSchema);

export default User;
