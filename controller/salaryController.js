import Salary from "../models/salaryModel.js";
import Employee from "../models/employeeModel.js";

export const addSalary = async (req, res) => {
  try {
    const { department, employee, salary, allowance, deduction, paymentDate } = req.body;

    // 1️⃣ Salary collection me nayi entry
    const newSalary = new Salary({
      department,
      employee,
      salary,
      allowance,
      deduction,
      paymentDate
    });
    await newSalary.save();

    // 2️⃣ Employee collection me salary update
    await Employee.findByIdAndUpdate(
      employee,
      { salary: salary }, // 👈 latest salary
      { new: true }
    );

    res.status(201).json({ success: true, message: "Salary added & employee updated successfully" });
  } catch (err) {
    console.error("Error adding salary:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSalaryByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: "Employee ID required" });
    }

    const salaries = await Salary.find({ employee: employeeId })
      .populate("employee", "employeeId") // fetch employeeId
      .populate("department", "dep_name"); // optional

    if (!salaries || salaries.length === 0) {
      return res.status(404).json({ success: false, message: "No salary records found" });
    }

    res.status(200).json({ success: true, salaries });
  } catch (error) {
    console.error("Error fetching salary:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const getEmployeeSalary = async (req, res) => {
  try {
    const userId = req.params.id; // userId frontend se aayega

    // 1️⃣ Employee ko userId ke basis par find karo
    const employee = await Employee.findOne({ userId }).lean();
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found for this user",
      });
    }

    // 2️⃣ Salary ko employee._id ke basis par find karo
    const salary = await Salary.findOne({ employee: employee._id })
      .populate("employee", "employeeId designation department")
      .populate("department", "name") // agar Salary schema me department hai
      .lean();

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary record not found for this employee",
      });
    }

    // 3️⃣ Response
    res.status(200).json({
      success: true,
      employee,
      salary,
    });
  } catch (error) {
    console.error("Error fetching employee salary:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};