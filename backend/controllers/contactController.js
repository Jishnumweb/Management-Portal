import Contact from "../models/Contact.js";

export const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;

    const skip = (page - 1) * limit;

    // -----------------------
    // BUILD FILTER OBJECT
    // -----------------------
    let filter = {};

    // 🔍 SEARCH across name, email, phone, company
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // 🔎 STATUS filter
    if (status) {
      filter.status = status;
    }

    // -----------------------
    // QUERY DATABASE
    // -----------------------
    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit)),
      Contact.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      contacts,
      total,
      page: Number(page),
      totalPages,
    });
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching contacts",
    });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, company, position, phone, email, status } = req.body;

    const newContact = await Contact.create({
      name,
      company,
      position,
      phone,
      email,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      contact: newContact,
    });
  } catch (error) {
    console.error("❌ Error creating contact:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating contact",
    });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      contact: updated,
    });
  } catch (error) {
    console.error("❌ Error updating contact:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating contact",
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting contact:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting contact",
    });
  }
};
