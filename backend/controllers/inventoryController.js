import Inventory from "../models/Inventory.js";

// =============================
// CREATE INVENTORY
// =============================
export const createInventory = async (req, res) => {
  try {
    const inventory = await Inventory.create(req.body);

    res.status(201).json({
      success: true,
      message: "Inventory item created successfully",
      inventory,
    });
  } catch (error) {
    console.error("❌ createInventory error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating inventory",
    });
  }
};

// =============================
// UPDATE INVENTORY
// =============================
export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Inventory.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      inventory: updated,
    });
  } catch (error) {
    console.error("❌ updateInventory error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating inventory",
    });
  }
};

// =============================
// DELETE INVENTORY
// =============================
export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Inventory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory deleted successfully",
    });
  } catch (error) {
    console.error("❌ deleteInventory error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting inventory",
    });
  }
};

// =============================
// GET ALL INVENTORY
// =============================
// Supports:
// search -> name, sku
// category -> filter
// status -> filter
// sortBy -> name, sku, quantity, category, sellingPrice
// sortDir -> asc | desc
// pagination -> page, limit
export const getAllInventories = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      status = "",
      sortBy = "createdAt",
      sortDir = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // SEARCH by name or sku
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    // FILTER by category
    if (category) query.category = category;

    // FILTER by status
    if (status) query.status = status;

    // SORTING
    const sortOptions = {};
    sortOptions[sortBy] = sortDir === "asc" ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    // PAGINATED DATA + TOTAL COUNT
    const [items, total] = await Promise.all([
      Inventory.find(query).sort(sortOptions).skip(skip).limit(Number(limit)),
      Inventory.countDocuments(query),
    ]);

    // 📊 INVENTORY STATS (Always based on full collection)
    const [inStock, outOfStock, lowStock] = await Promise.all([
      Inventory.countDocuments({ status: "in stock" }),
      Inventory.countDocuments({ status: "out of stock" }),
      Inventory.countDocuments({ status: "low stock" }), // you can adjust threshold
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      inventories: items,

      // 📊 Added Stats
      stats: {
        inStock,
        outOfStock,
        lowStock,
      },
    });
  } catch (error) {
    console.error("❌ getAllInventory error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching inventory",
    });
  }
};
