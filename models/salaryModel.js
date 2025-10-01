import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  salary: { type: Number, required: true },
  allowance: { type: Number, default: 0 },
  deduction: { type: Number, default: 0 },
  paymentDate: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model("Salary", salarySchema);
