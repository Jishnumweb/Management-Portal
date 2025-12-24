import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";

const useEmployeeStore = create((set, get) => ({
  attendance: null,
  weeklySummary: [],
  allRecords: [],

  profile: {},
  getProfile: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      if (res.data.success) {
        set({ profile: res.data.profile });
      }
      return res.data.profile;
    } catch (error) {
      console.error(
        "fetching profile error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Check-in
  checkIn: async () => {
    try {
      const res = await axiosInstance.post("/attendance/checkin");
      if (res.data.success) {
        set({ attendance: res.data.attendance });
      }
      return res.data;
    } catch (error) {
      console.error("Check-in error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Check-out
  checkOut: async () => {
    try {
      const res = await axiosInstance.post("/attendance/checkout");
      if (res.data.success) {
        set({ attendance: res.data.attendance });
      }
      return res.data;
    } catch (error) {
      console.error("Check-out error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get today’s attendance
  fetchTodayAttendance: async () => {
    try {
      const res = await axiosInstance.get("/attendance/today");
      if (res.data.success) {
        set({ attendance: res.data.attendance });
      }
      return res.data;
    } catch (error) {
      console.error(
        "Fetch today attendance error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get all attendance records
  fetchMyAttendance: async () => {
    try {
      const res = await axiosInstance.get("/attendance/me");
      if (res.data.success) {
        set({ allRecords: res.data.attendance });
      }
      return res.data.attendance;
    } catch (error) {
      console.error(
        "Fetch my attendance error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get weekly summary
  fetchWeeklySummary: async () => {
    try {
      const res = await axiosInstance.get("/attendance/weekly-summary");
      if (res.data.success) {
        set({ weeklySummary: res.data.summary });
      }
      return res.data.summary;
    } catch (error) {
      console.error(
        "Fetch weekly summary error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getMonthlyAttendance: async ({ page = 1, limit = 10, month }) => {
    const params = { page, limit };

    if (month) {
      params.month = month;
    }

    try {
      const res = await axiosInstance.get("/attendance/me/monthly", {
        params,
      });

      if (res.data.success) {
        return res.data;
      }
    } catch (error) {
      console.error(
        "fetchMonthlyAttendanceSummary error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  myLeaves: [],

  applyLeave: async (leaveData) => {
    try {
      const res = await axiosInstance.post("/leaves/apply", leaveData);

      if (res.data.success) {
        set((state) => ({
          myLeaves: [res.data.leave, ...state.myLeaves], // prepend new leave
        }));
      }

      return res.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Something went wrong while applying leave";

      toast.error(msg);
      throw error;
    }
  },

  getMyLeaves: async (queryParams = {}) => {
    try {
      const res = await axiosInstance.get("/leaves/my", {
        params: queryParams,
      });

      if (res.data.success) {
        set({
          myLeaves: res.data.leaves,
        });
        return res.data;
      }
    } catch (error) {
      console.error(
        "Get My Leaves Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteSingleLeaveDate: async (id, date) => {
    try {
      const res = await axiosInstance.delete("/leaves/my", {
        data: { id, date }, // 🟢 correct axios delete body
      });

      if (res.data.success) {
        const updatedLeave = res.data.leave; // null if deleted entirely

        set((state) => ({
          myLeaves: updatedLeave
            ? // Case 1 → leave still exists → update it
              state.myLeaves.map((leave) =>
                leave._id === id ? updatedLeave : leave
              )
            : // Case 2 → leave removed → filter it out
              state.myLeaves.filter((leave) => leave._id !== id),
        }));
      }
    } catch (error) {
      console.error(
        "Delete Leave Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getAllLeaveTypes: async (queryParams = {}) => {
    try {
      const res = await axiosInstance.get("/masters/leavetypes", {
        params: queryParams,
      });

      if (res.data.success) {
        return res.data;
      }
    } catch (error) {
      console.error(
        "Get My Leaves Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  myTasks: [],

  getMyTask: async (queryParams = {}) => {
    try {
      const queryString = new URLSearchParams(queryParams).toString();

      const res = await axiosInstance.get(`/tasks/my-task?${queryString}`);
      const { tasks, total, page, totalPages } = res.data;
      if (res.data.success) {
        set({
          myTasks: res.data.tasks,
        });
        return { tasks, total, currentPage: page, totalPages };
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  updateMyTask: async (id, updateData) => {
    try {
      const res = await axiosInstance.put(`/tasks/my-task/${id}`, updateData);

      if (res.data.success) {
        set((state) => ({
          myTasks: state.myTasks.map((task) =>
            task._id === id ? res.data.task : task
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating tasks:", error);
      throw error;
    }
  },

  acceptMyTask: async (id) => {
    try {
      const res = await axiosInstance.put(`/tasks/my-task/accept/${id}`);

      if (res.data.success) {
        set((state) => ({
          myTasks: state.myTasks.map((task) =>
            task._id === id ? { ...task, accepted: "Accepted" } : task
          ),
        }));
      }
    } catch (error) {
      console.error("Error accepting task:", error);
      throw error;
    }
  },

  rejectMyTask: async (id) => {
    try {
      const res = await axiosInstance.put(`/tasks/my-task/reject/${id}`);

      if (res.data.success) {
        set((state) => ({
          myTasks: state.myTasks.map((task) =>
            task._id === id ? { ...task, accepted: "Rejected" } : task
          ),
        }));
      }
    } catch (error) {
      console.error("Error rejecting task:", error);
      throw error;
    }
  },

  myMeetings: [],
  getMyMeetings: async (queryParams = {}) => {
    try {
      const queryString = new URLSearchParams(queryParams).toString();

      const res = await axiosInstance.get(
        `/meetings/my-meeting?${queryString}`
      );
      const { meetings, total, page, totalPages } = res.data;
      if (res.data.success) {
        set({
          myMeetings: res.data.meetings,
        });
        return { meetings, total, currentPage: page, totalPages };
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
      throw error;
    }
  },
}));

export default useEmployeeStore;
