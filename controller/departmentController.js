import Department from "../models/departmentModel.js";

export const addDepartment = async (req, res) => {
    try {
        const { dep_name, description } = req.body;

        const existingDep = await Department.findOne({ dep_name });
        if (existingDep) {
            return res.status(400).json({ success: false, error: "Department already exists" });
        }

        const newDep = new Department({
            dep_name,
            description
        });

        await newDep.save();

        return res.status(200).json({ success: true, department: newDep });
    } catch (error) {
        console.error("Error in addDepartment:", error);
        return res.status(500).json({ success: false, error: "Error in add department" });
    }
};


export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    console.error("Error in getDepartments:", error);
    return res.status(500).json({ success: false, error: "Error fetching departments" });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { dep_name, description },
      { new: true } // return updated doc
    );

    if (!updatedDepartment) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    return res.status(200).json({ success: true, department: updatedDepartment });
  } catch (error) {
    console.error("Error in updateDepartment:", error);
    return res.status(500).json({ success: false, error: "Error updating department" });
  }
};

// Delete Department
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Department.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    return res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error in deleteDepartment:", error);
    return res.status(500).json({ success: false, error: "Error deleting department" });
  }
};
