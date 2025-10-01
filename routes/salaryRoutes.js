import express from "express";
import { addSalary, getEmployeeSalary, getSalaryByEmployee } from "../controller/salaryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addSalary);
router.get("/employee/:employeeId", authMiddleware, getSalaryByEmployee);
router.get("/user/:id", authMiddleware, getEmployeeSalary);

export default router;
