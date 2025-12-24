import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllServices,
  createService,
  updateService,
  deleteService,
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getAllPositions,
  createPosition,
  updatePosition,
  deletePosition,
  getAllEmployeesAssociatedwithDepartment,
  getAllLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
  createBankDetails,
  getAllBankDetails,
  updateBankDetails,
  deleteBankDetails,
  getAllLeadReferences,
  createLeadReference,
  updateLeadReference,
  deleteLeadReference,
  getAllLeadStatus,
  createLeadStatus,
  updateLeadStatus,
  deleteLeadStatus,
  getAllLeadTypes,
  createLeadType,
  updateLeadType,
  deleteLeadType,
  getAllHolidayTypes,
  createHolidayType,
  updateHolidayType,
  deleteHolidayType,
  getAllHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  getAllTaskStatus,
  createTaskStatus,
  updateTaskStatus,
  deleteTaskStatus,
  getAllPriorities,
  createPriority,
  updatePriority,
  deletePriority,
} from "../controllers/masterController.js";

import upload, { uploadToCloudinary } from "../middlewares/upload.js";

const router = express.Router();

// GET all bank details
router.get("/bank-details", getAllBankDetails);

// POST new bank detail with QR code upload
router.post(
  "/bank-details",
  upload.single("qrCode"), // Multer parses the file
  uploadToCloudinary("bank-details/qr-code"), // Upload to Cloudinary
  createBankDetails
);

// PUT (update) bank detail with optional QR code
router.put(
  "/bank-details/:id",
  upload.single("qrCode"),
  uploadToCloudinary("bank-details/qr-code"),
  updateBankDetails
);

// DELETE bank detail
router.delete("/bank-details/:id", deleteBankDetails);

router.get("/products", getAllProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/services", getAllServices);
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

router.get("/leavetypes", getAllLeaveTypes);
router.post("/leavetypes", createLeaveType);
router.put("/leavetypes/:id", updateLeaveType);
router.delete("/leavetypes/:id", deleteLeaveType);

router.get("/lead-references", getAllLeadReferences);
router.post("/lead-references", createLeadReference);
router.put("/lead-references/:id", updateLeadReference);
router.delete("/lead-references/:id", deleteLeadReference);

router.get("/lead-status", getAllLeadStatus);
router.post("/lead-status", createLeadStatus);
router.put("/lead-status/:id", updateLeadStatus);
router.delete("/lead-status/:id", deleteLeadStatus);

router.get("/lead-types", getAllLeadTypes);
router.post("/lead-types", createLeadType);
router.put("/lead-types/:id", updateLeadType);
router.delete("/lead-types/:id", deleteLeadType);

router.get("/holidays", getAllHolidays);
router.post("/holidays", createHoliday);
router.put("/holidays/:id", updateHoliday);
router.delete("/holidays/:id", deleteHoliday);

router.get("/holiday-types", getAllHolidayTypes);
router.post("/holiday-types", createHolidayType);
router.put("/holiday-types/:id", updateHolidayType);
router.delete("/holiday-types/:id", deleteHolidayType);

router.get("/departments", getAllDepartments);
router.post("/departments", createDepartment);
router.put("/departments/:id", updateDepartment);
router.delete("/departments/:id", deleteDepartment);

router.get("/positions", getAllPositions);
router.post("/positions", createPosition);
router.put("/positions/:id", updatePosition);
router.delete("/positions/:id", deletePosition);

router.get("/task-status", getAllTaskStatus);
router.post("/task-status", createTaskStatus);
router.put("/task-status/:id", updateTaskStatus);
router.delete("/task-status/:id", deleteTaskStatus);

router.get("/priorities", getAllPriorities);
router.post("/priorities", createPriority);
router.put("/priorities/:id", updatePriority);
router.delete("/priorities/:id", deletePriority);

router.get("/departments/employees", getAllEmployeesAssociatedwithDepartment);

export default router;
