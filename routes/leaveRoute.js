import express from "express";
import { addLeave, getMyLeaves, getLeaveById, updateLeaveStatus, getAllLeaves, getLeavesByUser } from "../controller/leaveController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Add new leave (Employee)
router.get("/", authMiddleware, getAllLeaves);
router.post("/add", authMiddleware, addLeave);

// Get all leaves of logged in user
router.get("/my-leaves", authMiddleware, getMyLeaves);

router.get("/user/:id", authMiddleware, getLeavesByUser);


// Get leave by ID
router.get("/:id", authMiddleware, getLeaveById);

// Update leave status (Admin only)
router.put("/status/:id", authMiddleware, updateLeaveStatus);

export default router;
