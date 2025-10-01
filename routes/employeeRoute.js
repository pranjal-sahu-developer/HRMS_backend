import express from "express";
import authMiddleware from "../middleware/authMiddleware.js"
import { addEmployee, getAllEmployees, getEmployeeById, updateEmployee, getEmployeesByDepartment} from "../controller/employeeController.js";
import upload from "../uploads/multerConfig.js";

const router = express.Router();
router.post("/add",authMiddleware, upload.single("image"),addEmployee);
router.get("/list",authMiddleware,getAllEmployees);
router.get("/by-department/:departmentId", authMiddleware, getEmployeesByDepartment);
router.get("/:id", authMiddleware, getEmployeeById);
router.put("/update/:id", authMiddleware, updateEmployee);







export default router;