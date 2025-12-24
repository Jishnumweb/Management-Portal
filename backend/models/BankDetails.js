import mongoose from "mongoose";

const BankDetailsSchema = new mongoose.Schema(
  {
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    ifscCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    panNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    upiId: {
      type: String,
      required: true,
      trim: true,
    },
    qrCode: {
      type: String, // Store QR code URL or base64
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.BankDetails ||
  mongoose.model("BankDetails", BankDetailsSchema);
