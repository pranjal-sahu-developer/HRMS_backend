import express from "express";
import { addDepartment, getDepartments, updateDepartment, deleteDepartment } from "../controller/departmentController.js";
import authMiddleware from "../middleware/authMiddleware.js"


const router = express.Router();

router.post("/add",authMiddleware,addDepartment)
router.get("/list", authMiddleware, getDepartments);
router.put("/update/:id", authMiddleware, updateDepartment);  
router.delete("/delete/:id", authMiddleware, deleteDepartment);

export default router;