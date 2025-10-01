
import mongoose, { Schema } from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: Date
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },
    maritalStatus: {
      type: String,
      enum: ["single", "married"]
    },
    designation: {
      type: String
    },
    department: {
      type: Schema.Types.ObjectId, 
      ref:"Department",
      required: true,
    },
    salary: {
      type: Number,
      default:0,
    },
    createdAt: {
      type:Date,
      default:Date.now
    },
    updatedAt:{
      type:Date,
      default:Date.now
    }
  },
  { timestamps: true } // createdAt and updatedAt automatically create hoga
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
