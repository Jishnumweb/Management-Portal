import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    client_name: {
      type: String,
      required: true,
      trim: true,
    },
    official_phone: {
      type: String,
      trim: true,
    },
    alternate_phone: {
      type: String,
      trim: true,
    },
    official_email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    alternate_email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    gst_number: {
      type: String,
      trim: true,
    },
    company: {
      company_name: {
        type: String,
        trim: true,
      },
      company_address: {
        type: String,
        trim: true,
      },
      pin_code: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
