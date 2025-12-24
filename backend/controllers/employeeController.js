import mongoose from "mongoose";
import Employee from "../models/Employee.js";

/**
 * Create employee (improved): auto-generate employeeId if not provided
 * POST /api/employees
 */
export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      phone,
      department,
      position,
      status,
      password,
      joinDate,
      address,
      salary,
      role,
    } = req.body;

    // Check for duplicate email
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Employee with this email already exists",
      });
    }

    // Check for duplicate employeeId
    const existingEmployeeId = await Employee.findOne({ employeeId });
    if (existingEmployeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee with this employeeId already exists",
      });
    }

    // Create employee data object
    const employeeData = {
      name,
      employeeId,
      email,
      phone,
      status,
      password,
      joinDate,
      address,
      salary,
      role,
    };

    // Only include department if it’s not an empty string
    if (department && department.trim() !== "") {
      employeeData.department = department;
    }

    // Only include position if it’s not an empty string
    if (position && position.trim() !== "") {
      employeeData.position = position;
    }

    // Create employee
    const employee = await Employee.create(employeeData);

    // Populate related fields
    await employee.populate("department position");

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * Get single employee by id
 * GET /api/employees/:id
 */

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID format",
      });
    }

    // ✅ Fetch employee with populated department and position
    const employee = await Employee.findById(id).populate(
      "department position"
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("❌ Error fetching employee:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching employee details",
      error: error.message,
    });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const {
      departmentFilter,
      statusFilter,
      search = "",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // 🏢 Filter by department ID
    if (departmentFilter && mongoose.Types.ObjectId.isValid(departmentFilter)) {
      query.department = departmentFilter;
    }

    if (statusFilter) {
      query.status = statusFilter;
    }

    // 🔍 Search by name, email, or employeeId
    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ name: regex }, { email: regex }, { employeeId: regex }];
    }

    // 📄 Pagination setup
    const pageNum = Math.max(1, Number(page));
    const perPage = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * perPage;

    // ⚡ Fetch employees and total count in parallel
    const [employees, total] = await Promise.all([
      Employee.find(query)
        .select("-password") // 👈 Exclude password field
        .populate("department position")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),
      Employee.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      employees,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching employees",
      error: error.message,
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee id",
      });
    }

    const {
      name,
      email,
      phone,
      employeeId,
      department,
      position,
      status,
      password,
      joinDate,
      address,
      salary,
      role,
    } = req.body;

    // Check if employee exists
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Prevent duplicate email (if email changed)
    if (email && email !== employee.email) {
      const existing = await Employee.findOne({ email });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Another employee with this email already exists",
        });
      }
    }

    if (employeeId && employeeId !== employee.employeeId) {
      const existing = await Employee.findOne({ employeeId });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Another employee with this employeeId already exists",
        });
      }
    }

    // Update only provided fields
    if (name) employee.name = name;
    if (email) employee.email = email;
    if (phone) employee.phone = phone;
    if (employeeId) employee.employeeId = employeeId;
    if (department) employee.department = department;
    if (position) employee.position = position;
    if (status) employee.status = status;
    if (password) employee.password = password;
    if (joinDate) employee.joinDate = joinDate;
    if (address) employee.address = address;
    if (salary) employee.salary = salary;
    if (role) employee.role = role;

    const updatedEmployee = await employee.save();
    await updatedEmployee.populate("department position");

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({
      success: false,
      message: "Server error while updating employee",
      error: err.message,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee id",
      });
    }

    const deleted = await Employee.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({
      success: false,
      message: "Server error while deleting employee",
      error: err.message,
    });
  }
};
