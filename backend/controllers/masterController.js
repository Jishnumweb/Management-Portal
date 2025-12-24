import {
  Department,
  Position,
  LeaveType,
  BankDetails,
  LeadReference,
  LeadStatus,
  LeadType,
  HolidayType,
  TaskStatus,
  Priority,
  Holiday,
} from "../models/Master.js";
import Employee from "../models/Employee.js";
import Product from "../models/Product.js"; // must be imported first
import Service from "../models/Service.js";
import mongoose from "mongoose";

// Get All Bank Details
export const getAllBankDetails = async (req, res) => {
  try {
    const bankDetails = await BankDetails.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bankDetails,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Create bank details
export const createBankDetails = async (req, res) => {
  try {
    const {
      accountHolderName,
      accountNumber,
      bankName,
      branchName,
      ifscCode,
      panNumber,
      upiId,
    } = req.body;

    // Cloudinary URL from our middleware
    const qrCode = req.file?.cloudinary?.secure_url || "";

    console.log("Uploaded QR URL:", qrCode); // 🔥 Check URL in console

    const bankDetails = await BankDetails.create({
      accountHolderName,
      accountNumber,
      bankName,
      branchName,
      ifscCode,
      panNumber,
      upiId,
      qrCode,
    });

    return res.status(201).json({
      success: true,
      message: "Bank details created successfully",
      bankDetails,
    });
  } catch (error) {
    console.error("Create Bank Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Update bank details
export const updateBankDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      accountHolderName,
      accountNumber,
      bankName,
      branchName,
      ifscCode,
      panNumber,
      upiId,
    } = req.body;

    // New uploaded URL from Cloudinary (if any)
    const qrCode = req.file?.cloudinary?.secure_url;

    console.log("Updated QR URL:", qrCode);

    const updated = await BankDetails.findByIdAndUpdate(
      id,
      {
        accountHolderName,
        accountNumber,
        bankName,
        branchName,
        ifscCode,
        panNumber,
        upiId,
        ...(qrCode && { qrCode }), // only update if new file uploaded
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Bank details not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      bankDetails: updated,
    });
  } catch (error) {
    console.log("Update Bank Details Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Bank Details
export const deleteBankDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BankDetails.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Bank details not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Bank details deleted successfully",
      bankDetails: deleted,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "product name is required",
      });
    }

    const newProduct = await Product.create({ name });
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "product ID is required",
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deleteProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({})
      .populate("product", "name") // populate only product name
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("❌ Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching services",
    });
  }
};

// Create a new service
export const createService = async (req, res) => {
  try {
    const { name, product } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Service name is required",
      });
    }

    // Create service
    const newService = await Service.create({ name, product });

    // Populate product before sending response
    const populatedService = await Service.findById(newService._id).populate(
      "product"
    );

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service: populatedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
};

// Update a service by ID
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, product } = req.body;

    // Update service
    let updatedService = await Service.findByIdAndUpdate(
      id,
      { name, product },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Populate product before sending
    updatedService = await updatedService.populate("product");

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: error.message,
    });
  }
};

// Delete a service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required",
      });
    }

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      service: deletedService,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete service",
      error: error.message,
    });
  }
};

export const getAllLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      leaveTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leave types",
      error: error.message,
    });
  }
};

export const createLeaveType = async (req, res) => {
  try {
    const { leave_type, short_form, total_leaves, leaves_per_month } = req.body;

    const leaveType = await LeaveType.create({
      leave_type,
      short_form,
      total_leaves,
      leaves_per_month,
    });

    res.status(201).json({
      success: true,
      message: "Leave type created successfully",
      leaveType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create leave type",
      error: error.message,
    });
  }
};

export const updateLeaveType = async (req, res) => {
  try {
    const { id } = req.params;
    const { leave_type, short_form, total_leaves, leaves_per_month } = req.body;

    // Check if exists
    const existing = await LeaveType.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Leave type not found",
      });
    }

    existing.leave_type = leave_type;
    existing.short_form = short_form;
    existing.total_leaves = total_leaves;
    existing.leaves_per_month = leaves_per_month;

    await existing.save();

    res.status(200).json({
      success: true,
      message: "Leave type updated successfully",
      leaveType: existing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update leave type",
      error: error.message,
    });
  }
};

export const deleteLeaveType = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await LeaveType.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Leave type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Leave type deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete leave type",
      error: error.message,
    });
  }
};

// Get All Lead References
export const getAllLeadReferences = async (req, res) => {
  try {
    const references = await LeadReference.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      references,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Create Lead Reference
export const createLeadReference = async (req, res) => {
  try {
    const { leadReference } = req.body;

    const newRef = await LeadReference.create({ leadReference });

    return res.status(201).json({
      success: true,
      message: "Lead reference created successfully",
      reference: newRef,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Update Lead Reference
export const updateLeadReference = async (req, res) => {
  try {
    const { id } = req.params;
    const { leadReference } = req.body;

    const updated = await LeadReference.findByIdAndUpdate(
      id,
      { leadReference },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Lead reference not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Lead reference updated successfully",
      reference: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Lead Reference
export const deleteLeadReference = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await LeadReference.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Lead reference not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Lead reference deleted successfully",
      reference: deleted,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get All Lead Status
export const getAllLeadStatus = async (req, res) => {
  try {
    const statuses = await LeadStatus.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      leadStatuses: statuses,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Create Lead Status
export const createLeadStatus = async (req, res) => {
  try {
    const { leadStatus, shortForm, colorCode } = req.body;

    const newStatus = await LeadStatus.create({
      leadStatus,
      shortForm,
      colorCode,
    });

    return res.status(201).json({
      success: true,
      message: "Lead status created successfully",
      leadStatus: newStatus,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Update Lead Status
export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { leadStatus, shortForm, colorCode } = req.body;

    const updated = await LeadStatus.findByIdAndUpdate(
      id,
      { leadStatus, shortForm, colorCode },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Lead status not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      leadStatus: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Lead Status
export const deleteLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await LeadStatus.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Lead status not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Lead status deleted successfully",
      leadStatus: deleted,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET ALL LeadTypes
export const getAllLeadTypes = async (req, res) => {
  try {
    const leadTypes = await LeadType.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leadTypes.length,
      leadTypes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE LeadType
export const createLeadType = async (req, res) => {
  try {
    const { leadType } = req.body;

    if (!leadType) {
      return res
        .status(400)
        .json({ success: false, message: "Lead type is required" });
    }

    const exists = await LeadType.findOne({ leadType: leadType.trim() });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Lead type already exists" });
    }

    const newLeadType = await LeadType.create({ leadType });

    res.status(201).json({
      success: true,
      message: "Lead type created successfully",
      leadType: newLeadType,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE LeadType
export const updateLeadType = async (req, res) => {
  try {
    const { id } = req.params;
    const { leadType } = req.body;

    const updated = await LeadType.findByIdAndUpdate(
      id,
      { leadType },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Lead type not found" });
    }

    res.status(200).json({
      success: true,
      message: "Lead type updated successfully",
      leadType: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE LeadType
export const deleteLeadType = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await LeadType.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Lead type not found" });
    }

    res.status(200).json({
      success: true,
      message: "Lead type deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL Holiday Types
export const getAllHolidayTypes = async (req, res) => {
  try {
    const holidayTypes = await HolidayType.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      holidayTypes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE Holiday Type
export const createHolidayType = async (req, res) => {
  try {
    const { holidayType, color } = req.body;

    if (!holidayType) {
      return res.status(400).json({
        success: false,
        message: "holidayType is required",
      });
    }

    const newHolidayType = await HolidayType.create({ holidayType, color });

    res.status(201).json({
      success: true,
      message: "Holiday type created successfully",
      holidayType: newHolidayType,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE Holiday Type
export const updateHolidayType = async (req, res) => {
  try {
    const { id } = req.params;
    const { holidayType, color } = req.body;

    const updatedHolidayType = await HolidayType.findByIdAndUpdate(
      id,
      { holidayType, color },
      { new: true, runValidators: true }
    );

    if (!updatedHolidayType) {
      return res.status(404).json({
        success: false,
        message: "Holiday type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Holiday type updated successfully",
      holidayType: updatedHolidayType,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE Holiday Type
export const deleteHolidayType = async (req, res) => {
  try {
    const { id } = req.params;

    const holidayType = await HolidayType.findByIdAndDelete(id);

    if (!holidayType) {
      return res.status(404).json({
        success: false,
        message: "Holiday type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Holiday type deleted successfully",
      holidayType,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL Holiday
export const getAllHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find()
      .sort({ createdAt: -1 })
      .populate("holidayType");

    res.status(200).json({
      success: true,
      holidays,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE Holiday
export const createHoliday = async (req, res) => {
  try {
    const { holidayName, date, holidayType } = req.body;

    if ((!holidayName, !date, !holidayType)) {
      return res.status(400).json({
        success: false,
        message: "holidayName, date and holiday type are required",
      });
    }

    let newHoliday = await Holiday.create({ holidayName, date, holidayType });

    newHoliday = await newHoliday.populate("holidayType");

    res.status(201).json({
      success: true,
      message: "Holiday created successfully",
      holiday: newHoliday,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE Holiday
export const updateHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const { holidayName, date, holidayType } = req.body;

    let updatedHoliday = await Holiday.findByIdAndUpdate(
      id,
      { holidayName, date, holidayType },
      { new: true, runValidators: true }
    );

    if (!updatedHoliday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }

    updatedHoliday = await updatedHoliday.populate("holidayType");

    res.status(200).json({
      success: true,
      message: "Holiday updated successfully",
      holiday: updatedHoliday,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE Holiday
export const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;

    const holiday = await Holiday.findByIdAndDelete(id);

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Holiday deleted successfully",
      holiday,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      departments,
    });
  } catch (error) {
    console.error("❌ Error fetching departments:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching departments",
    });
  }
};

// Create a new department
export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    const existing = await Department.findOne({ name });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Department with this name already exists",
      });
    }

    const newDepartment = await Department.create({ name });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      department: newDepartment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create department",
      error: error.message,
    });
  }
};

// Update a department by ID
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // 1. Check if department exists
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // 2. Check if the new name already exists (but ignore the current department)
    const nameExists = await Department.findOne({
      name: name,
      _id: { $ne: id }, // ignore same department ID
    });

    if (nameExists) {
      return res.status(400).json({
        success: false,
        message: "Department name already exists",
      });
    }

    // 3. Update department
    department.name = name;
    await department.save();

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update department",
      error: error.message,
    });
  }
};

// Delete a department
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required",
      });
    }

    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
      department: deletedDepartment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete department",
      error: error.message,
    });
  }
};

export const getAllPositions = async (req, res) => {
  try {
    const positions = await Position.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      positions,
    });
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching positions",
    });
  }
};

// Create a new position
export const createPosition = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Position name is required",
      });
    }

    const existing = await Position.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Position with this name is already existed",
      });
    }

    const newPosition = await Position.create({ name });
    res.status(201).json({
      success: true,
      message: "Position created successfully",
      position: newPosition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create position",
      error: error.message,
    });
  }
};

// Update a position by ID
export const updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // 1. Check if position exists
    const position = await Position.findById(id);
    if (!position) {
      return res.status(404).json({
        success: false,
        message: "Position not found",
      });
    }

    // 2. Check if the new name already exists (but ignore the current position)
    const nameExists = await Position.findOne({
      name: name,
      _id: { $ne: id }, // ignore same position ID
    });

    if (nameExists) {
      return res.status(400).json({
        success: false,
        message: "Position name already exists",
      });
    }

    // 3. Update position
    position.name = name;
    await position.save();

    res.status(200).json({
      success: true,
      message: "Position updated successfully",
      position,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update position",
      error: error.message,
    });
  }
};

// Delete a position
export const deletePosition = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Position ID is required",
      });
    }

    const deletedPosition = await Position.findByIdAndDelete(id);

    if (!deletedPosition) {
      return res.status(404).json({
        success: false,
        message: "Position not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Position deleted successfully",
      position: deletedPosition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete position",
      error: error.message,
    });
  }
};

// GET ALL Task Status
export const getAllTaskStatus = async (req, res) => {
  try {
    const taskStatuses = await TaskStatus.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      taskStatuses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE Task Status
export const createTaskStatus = async (req, res) => {
  try {
    const { taskStatus, shortForm, colorCode } = req.body;

    if (!taskStatus || !shortForm || !colorCode) {
      return res.status(400).json({
        success: false,
        message: "taskStatus, shortForm and colorCode are required",
      });
    }

    const newTaskStatus = await TaskStatus.create({
      taskStatus,
      shortForm,
      colorCode,
    });

    res.status(201).json({
      success: true,
      message: "Task status created successfully",
      taskStatus: newTaskStatus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE Task Status
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskStatus, shortForm, colorCode } = req.body;

    const updatedTaskStatus = await TaskStatus.findByIdAndUpdate(
      id,
      { taskStatus, shortForm, colorCode },
      { new: true, runValidators: true }
    );

    if (!updatedTaskStatus) {
      return res.status(404).json({
        success: false,
        message: "Task status not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      taskStatus: updatedTaskStatus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE Task Status
export const deleteTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStatus = await TaskStatus.findByIdAndDelete(id);

    if (!deletedStatus) {
      return res.status(404).json({
        success: false,
        message: "Task status not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task status deleted successfully",
      taskStatus: deletedStatus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL Priorities
export const getAllPriorities = async (req, res) => {
  try {
    const priorities = await Priority.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      priorities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE Priority
export const createPriority = async (req, res) => {
  try {
    const { priority } = req.body;

    if (!priority) {
      return res.status(400).json({
        success: false,
        message: "priority field is required",
      });
    }

    const newPriority = await Priority.create({ priority });

    res.status(201).json({
      success: true,
      message: "Priority created successfully",
      priority: newPriority,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE Priority
export const updatePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    const updatedPriority = await Priority.findByIdAndUpdate(
      id,
      { priority },
      { new: true, runValidators: true }
    );

    if (!updatedPriority) {
      return res.status(404).json({
        success: false,
        message: "Priority not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Priority updated successfully",
      priority: updatedPriority,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE Priority
export const deletePriority = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPriority = await Priority.findByIdAndDelete(id);

    if (!deletedPriority) {
      return res.status(404).json({
        success: false,
        message: "Priority not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Priority deleted successfully",
      priority: deletedPriority,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllEmployeesAssociatedwithDepartment = async (req, res) => {
  try {
    const { department_id } = req.query;

    if (!department_id || !mongoose.Types.ObjectId.isValid(department_id)) {
      return res.status(400).json({
        success: false,
        message: "Valid department_id is required",
      });
    }

    // Fetch employees belonging to the department
    const employees = await Employee.find(
      { department: department_id },
      "_id name" // only return _id and name
    ).lean();

    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      employees,
    });
  } catch (error) {
    console.error("Error fetching employees for department:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};
