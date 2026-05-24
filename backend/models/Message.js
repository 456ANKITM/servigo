import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        required:true,
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    type:{
        type:String,
        enum:["text", "image", "file"],
        default:"text",
    },
    text:String,
    fileUrl: String,
    fileName: String,
    fileType:String,
    seenBy:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}]
},{timestamps:true})

const Message = mongoose.model("Message", messageSchema);

export default Message;