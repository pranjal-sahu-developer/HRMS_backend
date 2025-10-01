import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    dep_name:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
    updatedAt: {
        type:Date,
        default:Date.now
    }
},{ timestamps: true })

const Department = mongoose.model("Department",departmentSchema);
export default Department;