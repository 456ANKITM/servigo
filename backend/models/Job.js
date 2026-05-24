import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title:{
    type:String, 
    required:true,
    trim:true
  },
  description: {
    type:String,
    required:true
  },
  client:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  category:{
    type:String,
    required:true,
    enum:[
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
        "Baby Sitter",
        "Elderly Care"
    ]
  },
  location:{
    type:String, 
    required:true
  },
  status: {
    type:String,
    enum:["open", "in-progress", "completed"],
    default:"open"
  },
  budget: {
  type: {
    type: String,
    enum: ["fixed", "daily", "hourly", "monthly", "weekly", "negotiable"],
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
},
  skills:{
    type:[String],
    default:[]
  },
   appliedWorkers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  hiredWorker: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    default: null
  },
  completionRequest: {
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["none", "pending", "approved", "rejected"],
    default: "none",
  },
  requestedAt: Date,
  rejectedAt: Date,          
  rejectionReason: String,  
  approvedAt: Date, 
}
},{timestamps:true})

const Job = mongoose.model("Job", jobSchema);

export default Job;