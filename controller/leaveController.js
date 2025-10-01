import Leave from "../models/leaveModel.js";
import Employee from "../models/employeeModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
// Add new leave
export const addLeave = async (req, res) => {
  try {
    const { type, from, to, description } = req.body;
    if (!type || !from || !to || !description) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const leave = await Leave.create({
      userId: req.user._id,
      type,
      from,
      to,
      description,
    });

    return res.status(201).json({ success: true, leave });
  } catch (error) {
    console.error("Error adding leave:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Get all leaves of logged in user
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user._id }).sort({ appliedAt: -1 });
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Get leave by ID
export const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate("userId", "name email");
    if (!leave) return res.status(404).json({ success: false, error: "Leave not found" });
    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error("Error fetching leave:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Update leave status (Admin)
// Update leave status
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave not found" });
    }

    res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error("Error updating leave:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("userId", "name email")
      .sort({ appliedAt: -1 });

    const result = await Promise.all(
      leaves.map(async (leave) => {
        const employee = await Employee.findOne({ userId: leave.userId?._id })
          .populate("department", "dep_name")
          .select("employeeId department");

        const from = new Date(leave.from);
        const to = new Date(leave.to);
        const days =
          Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;

        return {
          _id: leave._id,
          employeeId: employee?.employeeId || "N/A",
          name: leave.userId?.name || "N/A",
          email: leave.userId?.email || "N/A",
          leaveType: leave.type,
          department: employee?.department?.dep_name || "N/A",
          days,
          from: leave.from,
          to: leave.to,
          description: leave.description,
          appliedDate: leave.appliedAt,
          status: leave.status,
        };
      })
    );

    res.status(200).json({ success: true, leaves: result });
  } catch (error) {
    console.error("❌ Error fetching leaves:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getLeavesByUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid or missing User ID" });
    }

    const userObjectId = new mongoose.Types.ObjectId(id); // ✅ use `new` here

    const leaves = await Leave.find({ userId: userObjectId })
      .populate("userId", "name email")
      .sort({ appliedAt: -1 });

    if (!leaves || leaves.length === 0) {
      return res.status(404).json({ success: false, message: "No leaves found" });
    }

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};