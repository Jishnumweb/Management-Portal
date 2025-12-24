import Client from "../models/Client.js";

// ==================== CREATE CLIENT ====================
export const createClient = async (req, res) => {
  try {
    const {
      client_name,
      official_phone,
      alternate_phone,
      official_email,
      alternate_email,
      website,
      gst_number,
      company = {},
    } = req.body;

    // Validation
    if (!client_name || !official_email) {
      return res.status(400).json({
        success: false,
        message: "client_name and official_email are required",
      });
    }

    // Create client
    const client = new Client({
      client_name,
      official_phone,
      alternate_phone,
      official_email,
      alternate_email,
      website,
      gst_number,
      company: {
        company_name: company.company_name,
        company_address: company.company_address,
        pin_code: company.pin_code,
        city: company.city,
        state: company.state,
        country: company.country,
      },
    });

    await client.save();

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating client",
      error: error.message,
    });
  }
};

// ==================== UPDATE CLIENT ====================
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      client_name,
      official_phone,
      alternate_phone,
      official_email,
      alternate_email,
      website,
      gst_number,
      company = {},
    } = req.body;

    // Find client
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // ✅ Update only if the field is truthy (non-empty and defined)
    if (client_name) client.client_name = client_name;
    if (official_phone) client.official_phone = official_phone;
    if (alternate_phone) client.alternate_phone = alternate_phone;
    if (official_email) client.official_email = official_email;
    if (alternate_email) client.alternate_email = alternate_email;
    if (website) client.website = website;
    if (gst_number) client.gst_number = gst_number;

    // ✅ Update company sub-fields if provided and truthy
    if (company) {
      if (company.company_name)
        client.company.company_name = company.company_name;
      if (company.company_address)
        client.company.company_address = company.company_address;
      if (company.pin_code) client.company.pin_code = company.pin_code;
      if (company.city) client.company.city = company.city;
      if (company.state) client.company.state = company.state;
      if (company.country) client.company.country = company.country;
    }

    await client.save();

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating client",
      error: error.message,
    });
  }
};

// ==================== DELETE CLIENT ====================
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
      client: deletedClient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting client",
      error: error.message,
    });
  }
};

// ==================== FETCH ALL CLIENTS (with search + pagination) ====================
export const getAllClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const searchFilter = search
      ? {
          $or: [
            { client_name: { $regex: search, $options: "i" } },
            { official_email: { $regex: search, $options: "i" } },
            { official_phone: { $regex: search, $options: "i" } },
            { "company.company_name": { $regex: search, $options: "i" } },
            { "company.city": { $regex: search, $options: "i" } },
            { "company.state": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const clients = await Client.find(searchFilter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Client.countDocuments(searchFilter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching clients",
      error: error.message,
    });
  }
};
