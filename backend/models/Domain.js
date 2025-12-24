import mongoose from "mongoose";

const RenewalHistorySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  cost: { type: Number, required: true },
});

const DomainSchema = new mongoose.Schema(
  {
    domainName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    company: { type: String },

    registrationDate: { type: Date },
    expiryDate: { type: Date },

    provider: { type: String },
    dnsProvider: { type: String },

    credentials: { type: String }, // You can later encrypt this
    renewalCost: { type: Number },

    status: {
      type: String,
      enum: ["Active", "Expired", "Expiring Soon"],
      default: "Active",
    },

    tags: [{ type: String }],

    notes: { type: String },

    alternateDomains: [{ type: String }],

    renewalHistory: [RenewalHistorySchema],
  },
  { timestamps: true }
);

export default mongoose.models.Domain || mongoose.model("Domain", DomainSchema);
