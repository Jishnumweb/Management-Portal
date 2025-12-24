import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/** 
 * Generate JWT token
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * @desc Register new admin
 * @route POST /api/admin/register
 */
// export const registerAdmin = async (req, res) => {
//   try {
//     const { name, email, password, permissions, active } = req.body;

//     if (!email || !password || !role) {
//       return res.status(400).json({
//         success: false,
//         message: "Email, password, and role are required",
//       });
//     }

//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(400).json({
//         success: false,
//         message: "Admin with this email already exists",
//       });
//     }

//     const newAdmin = await Admin.create({ email, password, role });

//     res.status(201).json({
//       success: true,
//       message: "Admin registered successfully",
//       data: {
//         _id: newAdmin._id,
//         email: newAdmin.email,
//         role: newAdmin.role,
//         active: newAdmin.active,
//       },
//     });
//   } catch (error) {
//     console.error("Error registering admin:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, permissions, active } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    const newAdmin = await Admin.create({
      name,
      email,
      password,
      permissions: permissions || [],
      active: active ?? true,
    });

    res.status(201).json({
      success: true,
      admin: {
        _id: newAdmin._id,
        email: newAdmin.email,
        name: newAdmin.name,
        permissions: newAdmin.permissions,
        role: newAdmin.role,
        active: newAdmin.active,
      },
    });
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc Get all admins
 * @route GET /api/admin
 */
export const getAllAdmins = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", active } = req.query;

    const query = {};

    // Search (name or email)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Active filter
    if (active === "true") query.active = true;
    if (active === "false") query.active = false;

    const skip = (page - 1) * limit;

    const [admins, total] = await Promise.all([
      Admin.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Admin.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      admins,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
    console.log(admins);
  } catch (error) {
    console.error("❌ Error getting admins:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching admins",
    });
  }
};

/**
 * @desc Toggle admin active status
 * @route PUT /api/admin/:id/status
 */
export const toggleAdminStatus = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    admin.active = !admin.active;
    await admin.save();

    res.status(200).json({
      success: true,
      message: `Admin ${
        admin.active ? "activated" : "deactivated"
      } successfully`,
      data: {
        id: admin._id,
        email: admin.email,
        active: admin.active,
      },
    });
  } catch (error) {
    console.error("Error updating admin status:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc Update Admin
 * @route PUT /api/admins/:id
 */
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, permissions, active } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;

    // permissions must overwrite full array
    if (permissions) admin.permissions = permissions;

    // active field
    if (active !== undefined) admin.active = active;

    // ❌ DO NOT hash — schema will handle hashing
    if (password) {
      admin.password = password; // raw password (schema will hash)
    }

    await admin.save();

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("❌ Error updating admin:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating admin",
    });
  }
};

/**
 * @desc Delete Admin
 * @route DELETE /api/admins/:id
 */
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    await Admin.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting admin:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting admin",
    });
  }
};
