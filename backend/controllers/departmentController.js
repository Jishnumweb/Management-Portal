// // controllers/organizationController.js

// import { Department, Position } from "../models/Master.js";

// // -------------------- DEPARTMENT --------------------

// // Create Department
// export const createDepartment = async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!name) return res.status(400).json({ message: "Name is required" });

//     const existing = await Department.findOne({ name });
//     if (existing)
//       return res.status(400).json({ message: "Department already exists" });

//     const dept = await Department.create({ name });
//     res.status(201).json(dept);
//   } catch (error) {
//     console.error("Create Department Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // Edit Department
// export const updateDepartment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name } = req.body;
//     if (!name) return res.status(400).json({ message: "Name is required" });

//     const updated = await Department.findByIdAndUpdate(
//       id,
//       { name },
//       { new: true }
//     );
//     if (!updated)
//       return res.status(404).json({ message: "Department not found" });

//     res.status(200).json(updated);
//   } catch (error) {
//     console.error("Update Department Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // Delete Department
// export const deleteDepartment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Department.findByIdAndDelete(id);
//     if (!deleted)
//       return res.status(404).json({ message: "Department not found" });

//     res.status(200).json({ message: "Department deleted successfully" });
//   } catch (error) {
//     console.error("Delete Department Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // List Departments
// export const listDepartments = async (req, res) => {
//   try {
//     const departments = await Department.find().sort({ name: 1 });
//     res.status(200).json(departments);
//   } catch (error) {
//     console.error("List Departments Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // -------------------- POSITION --------------------

// // Create Position
// export const createPosition = async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!name) return res.status(400).json({ message: "Name is required" });

//     const existing = await Position.findOne({ name });
//     if (existing)
//       return res.status(400).json({ message: "Position already exists" });

//     const pos = await Position.create({ name });
//     res.status(201).json(pos);
//   } catch (error) {
//     console.error("Create Position Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // Edit Position
// export const updatePosition = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name } = req.body;
//     if (!name) return res.status(400).json({ message: "Name is required" });

//     const updated = await Position.findByIdAndUpdate(
//       id,
//       { name },
//       { new: true }
//     );
//     if (!updated)
//       return res.status(404).json({ message: "Position not found" });

//     res.status(200).json(updated);
//   } catch (error) {
//     console.error("Update Position Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // Delete Position
// export const deletePosition = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Position.findByIdAndDelete(id);
//     if (!deleted)
//       return res.status(404).json({ message: "Position not found" });

//     res.status(200).json({ message: "Position deleted successfully" });
//   } catch (error) {
//     console.error("Delete Position Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // List Positions
// export const listPositions = async (req, res) => {
//   try {
//     const positions = await Position.find().sort({ name: 1 });
//     res.status(200).json(positions);
//   } catch (error) {
//     console.error("List Positions Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };
