import Meeting from "../models/Meeting.js";

// ============================
// CREATE MEETING
// ============================
export const createMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      meeting,
    });
  } catch (error) {
    console.error("Create Meeting Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create meeting",
      error: error.message,
    });
  }
};

// ============================
// GET ALL MEETINGS
// ============================
export const getAllMeetings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      type, // updated filter field
      date,
    } = req.query;

    const query = {};

    /** TEXT SEARCH (title, attendees, location) */
    if (search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { attendees: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    /** STATUS FILTER */
    if (status) {
      query.status = status;
    }

    /** TYPE FILTER */
    if (type) {
      query.type = type; // changed meetingType → type
    }

    /** DATE FILTER */
    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);

      query.date = {
        $gte: selectedDate,
        $lt: nextDay,
      };
    }

    /** PAGINATION */
    const skip = (page - 1) * limit;

    const [meetings, total] = await Promise.all([
      Meeting.find(query)
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit)),
      Meeting.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    console.error("Get Meetings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch meetings",
      error: error.message,
    });
  }
};

// ============================
// UPDATE MEETING
// ============================
export const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Meeting.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      meeting: updated,
    });
  } catch (error) {
    console.error("Update Meeting Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update meeting",
      error: error.message,
    });
  }
};

// ============================
// DELETE MEETING
// ============================
export const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Meeting.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    console.error("Delete Meeting Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete meeting",
      error: error.message,
    });
  }
};

export const getMyMeetings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      date,
    } = req.query;

    const skip = (page - 1) * limit;

    // Base query: Internal + Team Meetings
    const query = {
      type: { $in: ["Internal", "Team Meeting"] },
    };

    // 🔍 Search by title, location, organizer
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { organizer: { $regex: search, $options: "i" } },
      ];
    }

    // 🎯 Filter by status
    if (status) {
      query.status = status;
    }

    // 📅 Filter by date (full-day range)
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.date = { $gte: start, $lte: end };
    }

    // Fetch meetings + total count
    const [meetings, total] = await Promise.all([
      Meeting.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Meeting.countDocuments(query),
    ]);

    return res.json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      meetings,
    });

  } catch (error) {
    console.log("Get My Meetings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load meetings",
      error: error.message,
    });
  }
};

