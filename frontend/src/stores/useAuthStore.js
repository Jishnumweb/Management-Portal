import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

const useAuthStore = create((set, get) => ({
  user: null,

  login: async ({ email, password }) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      set({ user: res.data.user });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      throw error;
    }
  },

  //logout function for both admin and user
  logout: async () => {
    try {
      axiosInstance.post("/auth/logout");
      set({ user: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      throw error;
    }
  },
}));

export default useAuthStore;
