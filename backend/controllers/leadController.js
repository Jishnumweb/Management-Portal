import Lead from "../models/Lead.js";

/**
 * @desc Create a new lead
 * @route POST /api/leads
 */
export const createLead = async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      country,
      product,
      service,
      source,
      status,
      assignedTo,
      notes,
      followUpDate,
    } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Name and email are required" });
    }

    const newLead = await Lead.create({
      name,
      company,
      email,
      phone,
      country,
      product,
      service,
      source,
      status,
      assignedTo,
      notes,
      followUpDate,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead: newLead,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc Get all leads (with filters and pagination)
 * @route GET /api/leads
 */

export const getAllLeads = async (req, res) => {
  try {
    const {
      filterStatus = "all",
      filterSource = "all",
      filterService = "all",
      filterFollowUpDate,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // 🧩 Filtering
    if (filterStatus !== "all") query.status = filterStatus;
    if (filterSource !== "all") query.source = filterSource;
    if (filterService !== "all") query.service = filterService;

    if (filterFollowUpDate) {
      const start = new Date(filterFollowUpDate);
      const end = new Date(filterFollowUpDate);
      end.setDate(end.getDate() + 1);
      query.followUpDate = { $gte: start, $lt: end };
    }

    // 🔍 Case-insensitive search on multiple fields
    if (search?.trim()) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: regex },
        { company: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    const skip = (page - 1) * Number(limit);

    // ⚡ Fetch in parallel
    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate("assignedTo", "name email")
        .populate("service", "name") // ✅ populate service name for display
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Lead.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      leads,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Error fetching leads:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching leads",
      error: error.message,
    });
  }
};

/**
 * @desc Get single lead by ID
 * @route GET /api/leads/:id
 */
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "assignedTo",
      "name email"
    );

    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error("Error fetching lead:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc Update a lead
 * @route PUT /api/leads/:id
 */
export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    // Extract all possible fields
    const {
      name,
      company,
      email,
      phone,
      country,
      product,
      service,
      source,
      status,
      assignedTo,
      notes,
      followUpDate,
    } = req.body;

    // Prepare update object (only include fields that exist)
    const updateData = {};
    if (name) updateData.name = name;
    if (company) updateData.company = company;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (country) updateData.country = country;
    if (product) updateData.product = product;
    if (service) updateData.service = service;
    if (source) updateData.source = source;
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (notes) updateData.notes = notes;
    if (followUpDate) updateData.followUpDate = followUpDate;

    // Update only with filtered fields
    const updatedLead = await Lead.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      lead: updatedLead,
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * @desc Delete a lead
 * @route DELETE /api/leads/:id
 */
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
