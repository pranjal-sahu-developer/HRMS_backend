// controller/adminController.js
import User from "../models/userModel.js";
import Department from "../models/departmentModel.js";
import Leave from "../models/leaveModel.js";
import Employee from "../models/employeeModel.js";
import Salary from "../models/salaryModel.js";


// Admin Summary
export const getAdminSummary = async (req, res) => {
  try {
    // Total employees
    const totalEmployees = await Employee.countDocuments();

    // Total departments
    const totalDepartments = await Department.countDocuments();

    // Monthly salary (sum of all salaries)
    const employees = await Employee.find({}, "salary");
    const monthlySalary = employees.reduce((acc, emp) => acc + (emp.salary || 0), 0);


    // Leaves
    const leaveApplied = await Leave.countDocuments();
   const leaveApproved = await Leave.countDocuments({ status: "Approved" });
const leavePending  = await Leave.countDocuments({ status: "Pending" });
const leaveRejected = await Leave.countDocuments({ status: "Rejected" });


    // const leaveStatus = await Leave.aggregate([
    //     {
    //         $group: {
    //             _id : "status",
    //             count: {$sum : 1}
    //         }
    //     }
    // ])
    //  const leaveApplied = await Leave.countDocuments();
    // const leaveApproved =  leaveStatus.find(item => item._id === "Approved")?.count || 0;
    // const leaveRejected =  leaveStatus.find(item => item._id === "Rejected")?.count || 0;
    // const leavePending =   leaveStatus.find(item => item._id === "Pending")?.count || 0;


    return res.status(200).json({
      success: true,
      summary: {
        totalEmployees,
        totalDepartments,
        monthlySalary,
        leaveApplied,
        leaveApproved,
        leavePending,
        leaveRejected,
      },
    });
  } catch (error) {
    console.error("Error fetching admin summary:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
