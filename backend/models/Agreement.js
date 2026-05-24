import mongoose from "mongoose";

const agreementSchema = new mongoose.Schema({
    jobId:{type:mongoose.Schema.Types.ObjectId, ref:'Job', required:true},
    clientId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    workerId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true}
},{timeStamps:true})

agreementSchema.index({ jobId: 1 }, { unique: true });

const Agreement = mongoose.model('Agreement', agreementSchema);

export default Agreement;
