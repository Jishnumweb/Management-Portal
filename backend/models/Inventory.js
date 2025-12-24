import mongoose from "mongoose";

// Stock history sub-schema
const StockHistorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },
    quantity: { type: Number, required: true },
    date: { type: Date, required: true },
    notes: { type: String },
  },
  { _id: false }
);

// Main Item Schema
const InventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, trim: true },
    category: { type: String },
    brand: { type: String },

    quantity: { type: Number, default: 0 },
    minQty: { type: Number, default: 0 },

    purchasePrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },

    unit: { type: String, default: "pcs" },

    location: { type: String },
    supplier: { type: String },

    purchaseDate: { type: Date },
    warrantyDate: { type: Date },

    serialNumber: { type: String },

    tags: [{ type: String }],

    notes: { type: String },

    status: {
      type: String,
      enum: ["in stock", "low stock", "out of stock"],
      default: "in stock",
    },

    stockHistory: [StockHistorySchema],
  },
  { timestamps: true }
);

export default mongoose.models.InventoryItem ||
  mongoose.model("InventoryItem", InventoryItemSchema);
