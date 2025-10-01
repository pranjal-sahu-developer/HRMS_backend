import express from "express";
import { getAdminSummary } from "../controller/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.get("/summary", authMiddleware, getAdminSummary);

export default router;