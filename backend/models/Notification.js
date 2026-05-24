import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title: {
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:[
        "JOB_APPLICATION",
        "JOB_HIRED",
        "JOB_COMPLETED",
        "JOB_COMPLETION_REQUEST",
        "JOB_COMPLETION_REJECTED",
        "SYSTEM",
        ],
        default:"SYSTEM"
    },
    isRead:{
        type:Boolean,
        default: false
    }
},{timestamps:true})

const Notification = mongoose.model("notification", notificationSchema);

export default Notification;