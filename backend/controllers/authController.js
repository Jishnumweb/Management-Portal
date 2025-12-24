import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Employee from "../models/Employee.js";

// Utility: Generate token & set cookie
const generateToken = (res, userId, role, type) => {
  const token = jwt.sign({ id: userId, role, type }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict",
    maxAge: (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000, // days → ms
    path: "/",
  });

  return token;
};

// =========================================
// LOGIN for both Admin & Employee
// =========================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    let user = await Admin.findOne({ email });
    let type = "Admin";

    // If not found in Admins, check Employees
    if (!user) {
      user = await Employee.findOne({ email });
      type = "Employee";
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.active === false) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    // Create JWT token
    generateToken(res, user._id, user.role || "user", type);

    return res.status(200).json({
      success: true,
      message: `${type} logged in successfully`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        type,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// =========================================
// LOGOUT (clears cookie)
// =========================================
export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // must match login
      sameSite: "strict", // must match login
      expires: new Date(0), // expire immediately
      path: "/", // must match login
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Fetch full employee profile with populated fields
    const employee = await Employee.findById(user._id)
      .populate("department", "name") // populate only name field
      .populate("position", "name"); // populate only title field

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      profile: employee,
    });
  } catch (error) {
    console.error("Profile fetching error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};
