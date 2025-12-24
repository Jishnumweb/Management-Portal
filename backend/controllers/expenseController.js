import Expense from "../models/Expense.js";

// =====================================================
// GET ALL EXPENSES
// =====================================================
export const getAllExpenses = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      paymentMethod = "",
      month = "", // format: YYYY-MM
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // 🔍 Text Search (search across: category, vendor, notes)
    if (search) {
      query.$or = [
        { vendor: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
        { referenceId: { $regex: search, $options: "i" } },
      ];
    }

    // 🏷️ Filter: Category
    if (category) {
      query.category = category;
    }

    // 🏷️ Filter: Category
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    // 🗓️ Filter: Month (YYYY-MM)
    if (month) {
      const [year, monthNum] = month.split("-");
      const start = new Date(year, Number(monthNum) - 1, 1);
      const end = new Date(year, Number(monthNum), 0, 23, 59, 59, 999);

      query.date = { $gte: start, $lte: end };
    }

    // 📌 Pagination
    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      Expense.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Expense.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      expenses,
    });
  } catch (error) {
    console.error("❌ Error fetching expenses:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching expenses",
    });
  }
};

// =====================================================
// CREATE EXPENSE
// =====================================================
export const createExpense = async (req, res) => {
  try {
    const {
      date,
      entryDate,
      category,
      amount,
      gstPercent,
      gstAmount,
      total,
      paymentMethod,
      referenceId,
      vendor,
      notes,
    } = req.body;

    // Cloudinary uploaded file URL
    const receipt = req.file?.cloudinary?.secure_url || "";

    console.log("Receipt URL:", receipt);

    const newExpense = await Expense.create({
      date,
      entryDate,
      category,
      amount,
      gstPercent,
      gstAmount,
      total,
      paymentMethod,
      referenceId,
      vendor,
      notes,
      receipt,
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error("❌ Error creating expense:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating expense",
    });
  }
};

// =====================================================
// UPDATE EXPENSE
// =====================================================
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      date,
      entryDate,
      category,
      amount,
      gstPercent,
      gstAmount,
      total,
      paymentMethod,
      referenceId,
      vendor,
      notes,
    } = req.body;

    const updateData = {
      date,
      entryDate,
      category,
      amount,
      gstPercent,
      gstAmount,
      total,
      paymentMethod,
      referenceId,
      vendor,
      notes,
    };

    // Replace receipt only if a new one uploaded
    if (req.file?.cloudinary?.secure_url) {
      console.log("New receipt uploaded:", req.file.cloudinary);
      updateData.receipt = req.file.cloudinary.secure_url;
    }

    const updated = await Expense.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense: updated,
    });
  } catch (error) {
    console.error("❌ Error updating expense:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating expense",
    });
  }
};

// =====================================================
// DELETE EXPENSE
// =====================================================
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Expense.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting expense:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting expense",
    });
  }
};

// =====================================================
// GET EXPENSE STATISTICS (TOTALS + OPTIONAL MONTH FILTER)
// =====================================================
export const getExpenseStats = async (req, res) => {
  try {
    const { month } = req.query;
    console.log(month);

    let filter = {};

    // If month filter provided → convert to date range
    if (month) {
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);

      filter.date = { $gte: startDate, $lt: endDate };
    }

    const expenses = await Expense.find(filter);

    // Calculate totals
    let totalExpenses = 0;
    let totalGST = 0;
    let grandTotal = 0;

    expenses.forEach((e) => {
      totalExpenses += e.amount || 0;
      totalGST += e.gstAmount || 0;
      grandTotal += e.total || 0;
    });

    return res.status(200).json({
      success: true,
      month: month || "ALL",
      totalEntries: expenses.length,
      totalExpenses,
      totalGST,
      grandTotal,
    });
  } catch (error) {
    console.error("❌ Error getting expense stats:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching expense statistics",
    });
  }
};
