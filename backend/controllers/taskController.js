import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      priority,
      status,
      employee,
      client,
      dueDate,
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const filters = {};

    // 🔎 Search: title OR description
    if (search.trim() !== "") {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 🎯 Priority filter
    if (priority) {
      filters.priority = priority;
    }

    // 🎯 Status filter
    if (status) {
      filters.status = status;
    }

    // 👨‍💼 Employee filter (assignedTo is an array)
    if (employee) {
      filters.assignedTo = { $in: [employee] };
    }

    // 🧑‍💼 Client name
    if (client) {
      filters.clientName = client;
    }

    // 📅 Due Date filter (Exact date)
    if (dueDate) {
      const start = new Date(dueDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(dueDate);
      end.setHours(23, 59, 59, 999);

      filters.dueDate = { $gte: start, $lte: end };
    }

    // 📌 Query DB
    const tasks = await Task.find(filters)
      .populate("priority")
      .populate("status")
      .populate("assignedTo")
      .populate("clientName")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(filters);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      tasks,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: e.message,
    });
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      title,
      priority,
      status,
      assignedTo = [],
      clientName,
      description,
      dueDate,
    } = req.body;

    if (!title || !priority || !status || !dueDate || !assignedTo) {
      return res.status(400).json({
        success: false,
        message:
          "Title, Priority, Status, assigned employee & Due Date are required",
      });
    }

    // Create task
    const task = await Task.create({
      title,
      priority,
      status,
      assignedTo,
      clientName: clientName || null,
      description,
      dueDate,
    });

    // Populate before sending response
    const populatedTask = await Task.findById(task._id)
      .populate("priority")
      .populate("status")
      .populate("assignedTo")
      .populate("clientName");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const {
      title,
      priority,
      status,
      assignedTo = [],
      clientName,
      description,
      dueDate,
    } = req.body;

    // Update task
    const updated = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        priority,
        status,
        assignedTo,
        clientName: clientName || null,
        description,
        dueDate,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Populate data before sending response
    const populatedTask = await Task.findById(updated._id)
      .populate("priority")
      .populate("status")
      .populate("assignedTo")
      .populate("clientName");

    res.json({
      success: true,
      message: "Task updated successfully",
      task: populatedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const deleted = await Task.findByIdAndDelete(taskId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

export const getMyTask = async (req, res) => {
  try {
    const employeeId = req.user._id; // Logged-in employee

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, priority, search } = req.query;

    let query = {
      assignedTo: employeeId, // Task schema supports array → this works!
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate("priority", "priority color") // Populate Priority
        .populate("status", "taskStatus color") // Populate TaskStatus
        .populate("assignedTo", "name email") // Populate Employee
        .populate("clientName", "name") // Populate Client
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Task.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      tasks,
    });
  } catch (error) {
    console.error("Error fetching employee tasks:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

export const updateMyTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const employeeId = req.user._id;

    const { status, timeSpent, percentageComplete } = req.body;

    // Fetch task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if employee is assigned
    if (!task.assignedTo.includes(employeeId)) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this task",
      });
    }

    // Only update fields that are present
    const updateData = {};

    if (status !== undefined) updateData.status = status;
    if (timeSpent !== undefined) updateData.timeSpent = timeSpent;
    if (percentageComplete !== undefined)
      updateData.percentageComplete = percentageComplete;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
    })
      .populate("priority")
      .populate("status")
      .populate("assignedTo")
      .populate("clientName");

    return res.json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.log("Edit Task Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

export const acceptMyTask = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const taskId = req.params.id;

    // Fetch task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Ensure employee is assigned
    if (!task.assignedTo.includes(employeeId)) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this task",
      });
    }

    // Update acceptance
    task.accepted = "Accepted";
    await task.save();

    res.json({
      success: true,
      message: "Task accepted successfully",
      task,
    });
  } catch (error) {
    console.error("Accept task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to accept task",
      error: error.message,
    });
  }
};

export const rejectMyTask = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!task.assignedTo.includes(employeeId)) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this task",
      });
    }

    task.accepted = "Rejected";
    await task.save();

    res.json({
      success: true,
      message: "Task rejected successfully",
      task,
    });
  } catch (error) {
    console.error("Reject task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject task",
      error: error.message,
    });
  }
};
