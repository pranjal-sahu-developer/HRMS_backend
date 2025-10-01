import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import Employee from "../models/employeeModel.js";
import Department from "../models/departmentModel.js";
import Salary from "../models/salaryModel.js"
import mongoose from "mongoose";

// ============================
// Add New Employee
// ============================
// export const addEmployee = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       employeeId,
//       dob,
//       gender,
//       maritalStatus,
//       designation,
//       department,
//       salary,
//       password,
//       role,
//     } = req.body;

//     // File from multer
//     const profileImage = req.file ? req.file.path : null;

//     // 1. Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ success: false, error: "User already exists with this email" });
//     }

//     // 2. Validate department
//     const dep = await Department.findById(department);
//     if (!dep) {
//       return res.status(404).json({ success: false, error: "Department not found" });
//     }

//     // 3. Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 4. Create User
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       profileImage, // <-- storing image path
//     });

//     // 5. Create Employee linked with User
//     const newEmployee = await Employee.create({
//       userId: newUser._id,
//       employeeId,
//       dob,
//       gender,
//       maritalStatus,
//       designation,
//       department,
//       salary,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Employee created successfully",
//       employee: newEmployee,
//       user: newUser,
//     });
//   } catch (error) {
//     console.error("Error in addEmployee:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

export const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({
    success: false,
    error: "Invalid email format",
  });
}

    // File from multer
    const profileImage = req.file ? req.file : null;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists with this email" });
    }

    // 2. Validate department
    const dep = await Department.findById(department);
    if (!dep) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    // 3. Password validation
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long",
      });
    }

    // 4. File validation (if image uploaded)
    if (profileImage) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(profileImage.mimetype)) {
        return res.status(400).json({
          success: false,
          error: "Only JPG and PNG images are allowed",
        });
      }
      if (profileImage.size > 2 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          error: "File size should not exceed 2MB",
        });
      }
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: profileImage ? profileImage.path : null,
    });

    // 7. Create Employee linked with User
    const newEmployee = await Employee.create({
      userId: newUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: newEmployee,
      user: newUser,
    });
  } catch (error) {
    console.error("Error in addEmployee:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// ============================
// Update Employee
// ============================
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, employeeId, designation, department, salary } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

    // Update fields
    if (name) employee.userId.name = name;
    if (employeeId) employee.employeeId = employeeId;
    if (designation) employee.designation = designation;
    if (department) employee.department = department;
    if (salary) employee.salary = salary;

    await employee.save();

    res.status(200).json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", "name email role profileImage") // User details
      .populate("department", "dep_name description");    // Department details

    res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error("Error in getAllEmployees:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

       if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid employee ID" });
    }
    
    let employee;
   employee = await Employee.findById(id)
      .populate("userId", "name email role profileImage")
      .populate("department", "dep_name description");

    if (!employee) {
     employee= await Employee.findOne({userId: id})
      .populate("userId", "name email role profileImage")
      .populate("department", "dep_name description");

    }

    res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getEmployeesByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    if (!departmentId) {
      return res.status(400).json({ message: "Department ID required" });
    }

    const employees = await Employee.find({ department: departmentId })
      .populate("userId", "name email"); // agar userId ke andar name store hai

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found in this department" });
    }

    return res.status(200).json({ employees }); // 👈 object ke andar bhejna
  } catch (error) {
    console.error("Error fetching employees by department:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
