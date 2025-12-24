import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

const useAdminStore = create((set, get) => ({
  leads: [],

  // Get all leads
  getAllLeads: async (filters = {}) => {
    try {
      const res = await axiosInstance.get("/leads", { params: filters });

      if (res.data.success) {
        const { leads, total, page, totalPages } = res.data;

        // Update Zustand state
        if (!filters.forPdf) {
          set({ leads: res.data.leads });
        }

        // Also return values if you want to use them immediately
        return { leads, total, currentPage: page, totalPages };
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error(error.response?.data?.message || "Failed to fetch leads");
      return { leads: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  // Create a new lead
  createLead: async (leadData) => {
    try {
      const res = await axiosInstance.post("/leads", leadData);
      if (res.data.success) {
        toast.success("Lead created successfully");
        // Add new lead to local state
        set((state) => ({
          leads: [res.data.lead, ...state.leads],
        }));
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error(error.response?.data?.message || "Failed to create lead");
    }
  },

  // Update lead by ID
  updateLead: async (id, updateData) => {
    try {
      const res = await axiosInstance.put(`/leads/${id}`, updateData);
      if (res.data.success) {
        toast.success("Lead updated successfully");
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead._id === id ? res.data.lead : lead
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error(error.response?.data?.message || "Failed to update lead");
    }
  },

  // Delete lead by ID
  deleteLead: async (id) => {
    try {
      const res = await axiosInstance.delete(`/leads/${id}`);
      if (res.data.success) {
        toast.success("Lead deleted successfully");
        set((state) => ({
          leads: state.leads.filter((lead) => lead._id !== id),
        }));
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error(error.response?.data?.message || "Failed to delete lead");
    }
  },

  meetings: [],

  // Get all meetings
  getAllMeetings: async (filters = {}) => {
    try {
      const res = await axiosInstance.get("/meetings", { params: filters });

      if (res.data.success) {
        const { meetings, total, page, totalPages } = res.data;

        set({ meetings: res.data.meetings });

        // Also return values if you want to use them immediately
        return { meetings, total, currentPage: page, totalPages };
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast.error(error.response?.data?.message || "Failed to fetch meetings");
      return { meetings: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  // Create a new meeting
  createMeeting: async (meetingData) => {
    try {
      const res = await axiosInstance.post("/meetings", meetingData);
      if (res.data.success) {
        toast.success("Meeting created successfully");
        // Add new meeting to local state
        set((state) => ({
          meetings: [res.data.meeting, ...state.meetings],
        }));
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error(error.response?.data?.message || "Failed to create meeting");
      throw error;
    }
  },

  // Update meeting by ID
  updateMeeting: async (id, updateData) => {
    try {
      const res = await axiosInstance.put(`/meetings/${id}`, updateData);
      if (res.data.success) {
        toast.success("Meeting updated successfully");
        set((state) => ({
          meetings: state.meetings.map((meeting) =>
            meeting._id === id ? res.data.meeting : meeting
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating meeting:", error);
      toast.error(error.response?.data?.message || "Failed to update meeting");
      throw error;
    }
  },

  // Delete meeting by ID
  deleteMeeting: async (id) => {
    try {
      const res = await axiosInstance.delete(`/meetings/${id}`);
      if (res.data.success) {
        toast.success("Meeting deleted successfully");
        set((state) => ({
          meetings: state.meetings.filter((meeting) => meeting._id !== id),
        }));
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast.error(error.response?.data?.message || "Failed to delete meeting");
    }
  },

  products: [],
  getAllProducts: async () => {
    try {
      const res = await axiosInstance.get("/masters/products");

      if (res.data.success) {
        set({ products: res.data.products });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }
  },

  createProduct: async (data) => {
    try {
      const res = await axiosInstance.post("/masters/products", data);

      set((state) => ({
        products: [res.data.product, ...state.products],
      }));
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error.response?.data?.message || "Failed to create product");
    }
  },

  updateProduct: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/masters/products/${id}`, data);

      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? res.data.product : product
        ),
      }));
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  },

  deleteProduct: async (id) => {
    try {
      console.log(id);
      const res = await axiosInstance.delete(`/masters/products/${id}`);

      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  },

  services: [],
  getAllServices: async () => {
    try {
      const res = await axiosInstance.get("/masters/services");

      if (res.data.success) {
        set({ services: res.data.services });
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error(error.response?.data?.message || "Failed to fetch services");
    }
  },

  createService: async (serviceData) => {
    try {
      const res = await axiosInstance.post("/masters/services", serviceData);

      set((state) => ({
        services: [res.data.service, ...state.services],
      }));
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error(error.response?.data?.message || "Failed to create service");
    }
  },

  updateService: async (id, serviceData) => {
    try {
      const res = await axiosInstance.put(
        `/masters/services/${id}`,
        serviceData
      );

      set((state) => ({
        services: state.services.map((service) =>
          service._id === id ? res.data.service : service
        ),
      }));
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error(error.response?.data?.message || "Failed to update service");
    }
  },

  deleteService: async (id) => {
    try {
      const res = await axiosInstance.delete(`/masters/services/${id}`);

      set((state) => ({
        services: state.services.filter((service) => service._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error(error.response?.data?.message || "Failed to delete service");
    }
  },

  //only name and _id are fetching
  getAllEmployeesAssociatedwithDepartment: async (department_id) => {
    try {
      const params = {};
      if (department_id) params.department_id = department_id;
      console.log(params);

      const res = await axiosInstance.get("/masters/departments/employees", {
        params,
      });

      if (res.data.success) {
        return res.data.employees; // array of { _id, name }
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error(error.response?.data?.message || "Failed to fetch employees");
    }
  },

  employees: [],

  // Get all employees
  getAllEmployees: async (filters = {}) => {
    try {
      const res = await axiosInstance.get("/employees", { params: filters });

      if (res.data.success) {
        const { employees, total, page, totalPages } = res.data;

        // Update Zustand state
        set({ employees });

        // Also return values if you want to use them immediately
        return { employees, total, currentPage: page, totalPages };
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error(error.response?.data?.message || "Failed to fetch Employees");
      return { employees: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  // Create a new employee
  createEmployee: async (employeeData) => {
    try {
      const res = await axiosInstance.post("/employees", employeeData);
      if (res.data.success) {
        toast.success("Employee created successfully");
        // Add new employee to local state
        set((state) => ({
          employees: [res.data.employee, ...state.employees],
        }));
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error(error.response?.data?.message || "Failed to create employee");
    }
  },

  // Update employee by ID
  updateEmployee: async (id, updateData) => {
    try {
      const res = await axiosInstance.put(`/employees/${id}`, updateData);
      if (res.data.success) {
        toast.success("Employee updated successfully");
        set((state) => ({
          employees: state.employees.map((employee) =>
            employee._id === id ? res.data.employee : employee
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error(error.response?.data?.message || "Failed to update employee");
    }
  },

  // Delete employee by ID
  deleteEmployee: async (id) => {
    try {
      const res = await axiosInstance.delete(`/employees/${id}`);
      if (res.data.success) {
        toast.success("employee deleted successfully");
        set((state) => ({
          employees: state.employees.filter((employee) => employee._id !== id),
        }));
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error(error.response?.data?.message || "Failed to delete employee");
    }
  },

  clients: [],

  // Get all clients (with optional filters: page, limit, search)
  getAllClients: async (filters = {}) => {
    try {
      const res = await axiosInstance.get("/clients", { params: filters });

      if (res.data.success) {
        const { clients, total, page, pages } = res.data;

        // Update Zustand state
        set({ clients });

        // Return data if needed for pagination UI
        return {
          clients,
          total,
          currentPage: page,
          totalPages: pages,
        };
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error(error.response?.data?.message || "Failed to fetch clients");
      return { clients: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  // Create a new client
  createClient: async (clientData) => {
    try {
      const res = await axiosInstance.post("/clients", clientData);
      if (res.data.success) {
        toast.success("Client created successfully");

        // Add the new client to state
        set((state) => ({
          clients: [res.data.client, ...state.clients],
        }));
      }
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error(error.response?.data?.message || "Failed to create client");
    }
  },

  // Update a client by ID
  updateClient: async (id, updateData) => {
    try {
      const res = await axiosInstance.put(`/clients/${id}`, updateData);
      if (res.data.success) {
        toast.success("Client updated successfully");

        // Update client in state
        set((state) => ({
          clients: state.clients.map((client) =>
            client._id === id ? res.data.client : client
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error(error.response?.data?.message || "Failed to update client");
    }
  },

  // Delete a client by ID
  deleteClient: async (id) => {
    try {
      const res = await axiosInstance.delete(`/clients/${id}`);
      if (res.data.success) {
        toast.success("Client deleted successfully");

        // Remove client from state
        set((state) => ({
          clients: state.clients.filter((client) => client._id !== id),
        }));
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error(error.response?.data?.message || "Failed to delete client");
    }
  },

  tasks: [],

  // Get all task (with optional filters: page, limit, search)
  getAllTasks: async (filters = {}) => {
    try {
      const res = await axiosInstance.get("/tasks", { params: filters });

      if (res.data.success) {
        const { tasks, total, page, pages } = res.data;

        // Update Zustand state
        set({ tasks });

        // Return data if needed for pagination UI
        return {
          tasks,
          total,
          currentPage: page,
          totalPages: pages,
        };
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
      return { clients: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const res = await axiosInstance.post("/tasks", taskData);
      if (res.data.success) {
        toast.success("task created successfully");

        // Add the new task to state
        set((state) => ({
          tasks: [res.data.task, ...state.tasks],
        }));
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(error.response?.data?.message || "Failed to create task");
    }
  },

  // Update a task by ID
  updateTask: async (id, updateData) => {
    try {
      const res = await axiosInstance.put(`/tasks/${id}`, updateData);
      if (res.data.success) {
        toast.success("task updated successfully");

        // Update task in state
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === id ? res.data.task : task
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  },

  // Delete a task by ID
  deleteTask: async (id) => {
    try {
      const res = await axiosInstance.delete(`/tasks/${id}`);
      if (res.data.success) {
        toast.success("task deleted successfully");

        // Remove task from state
        set((state) => ({
          tasks: state.tasks.filter((task) => task._id !== id),
        }));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  },

  monthlySummary: [],
  // monthlyMeta: {},
  attendanceRecords: [],
  // attendanceMeta: {},
  // filterDate: null,

  // Fetch monthly summary (admin)
  fetchMonthlyAttendanceSummary: async ({
    page = 1,
    limit = 10,
    search = "",
    month,
    department = "",
  } = {}) => {
    try {
      const params = { page, limit, search };
      if (month) params.month = month; // 1-12
      if (department) params.department = department; // 1-12

      const res = await axiosInstance.get("/attendance/admin/monthly", {
        params,
      });

      if (res.data?.success) {
        set({
          monthlySummary: res.data.monthlySummary || [],
        });
      }

      return res.data;
    } catch (error) {
      console.error(
        "fetchMonthlyAttendanceSummary error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Fetch attendance details (admin) with optional date filter
  fetchAttendanceDetails: async ({
    date = null,
    page = 1,
    limit = 10,
    department = "",
    employeeId = "",
  } = {}) => {
    try {
      const params = { page, limit };
      if (date) params.date = date; // expect YYYY-MM-DD
      if (department) {
        params.department = department;
        if (employeeId) {
          params.employeeId = employeeId;
        }
      }

      const res = await axiosInstance.get("/attendance/admin/details", {
        params,
      });

      if (res.data?.success) {
        set({
          attendanceRecords: res.data.attendanceRecords || [],
        });
      }

      return res.data;
    } catch (error) {
      console.error(
        "fetchAttendanceDetails error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  adminLeaves: [],

  // ----------------------------
  // Get All Leaves - Admin
  // supports: page, limit, date filter, search
  // ----------------------------
  getAllLeavesForAdmin: async ({
    page = 1,
    limit = 10,
    department = "",
    search = "",
    status = "",
    date = "",
  } = {}) => {
    try {
      // Build query params dynamically
      const queryParams = { page, limit };

      if (date) queryParams.date = date;
      if (department) queryParams.department = department;
      if (search) queryParams.search = search;
      if (status) queryParams.status = status;

      const res = await axiosInstance.get("/leaves/admin", {
        params: queryParams,
      });

      if (res.data.success) {
        return res.data;
      }
    } catch (error) {
      console.error(
        "Get Admin Leaves Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateLeaveStatus: async (data) => {
    try {
      const res = await axiosInstance.put(`/leaves/status/update`, data);

      if (res.data.success) {
        // Update admin leaves list instantly
        get().getAllLeavesForAdmin();
      }
    } catch (error) {
      console.error(
        "Change Status Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getAllBankDetails: async () => {
    try {
      const res = await axiosInstance.get("/masters/bank-details");

      if (res.data.success) {
        return res.data.bankDetails;
      }

      return null;
    } catch (error) {
      console.error("Error fetching bank details:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch bank details"
      );
      throw error;
    }
  },

  createBankDetails: async (data) => {
    try {
      const res = await axiosInstance.post("/masters/bank-details", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        return res.data.bankDetails;
      }

      return null;
    } catch (error) {
      console.error("Error creating bank details:", error);
      toast.error(
        error.response?.data?.message || "Failed to create bank details"
      );
      throw error;
    }
  },

  updateBankDetails: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/masters/bank-details/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        return res.data.bankDetails;
      }

      return null;
    } catch (error) {
      console.error("Error updating bank details:", error);
      toast.error(
        error.response?.data?.message || "Failed to update bank details"
      );
      throw error;
    }
  },

  deleteBankDetails: async (id) => {
    try {
      console.log(id);
      const res = await axiosInstance.delete(`/masters/bank-details/${id}`);

      if (res.data.success) {
        return res.data.bankDetails;
      }

      return null;
    } catch (error) {
      console.error("Error deleting bank details:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete bank details"
      );
      throw error;
    }
  },

  getAllLeaveTypes: async () => {
    try {
      const res = await axiosInstance.get("/masters/leavetypes");

      if (res.data.success) {
        return res.data.leaveTypes;
      }

      return null;
    } catch (error) {
      console.error("Error fetching leave types:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch leave types"
      );
      throw error;
    }
  },

  createLeaveType: async (data) => {
    try {
      const res = await axiosInstance.post("/masters/leavetypes", data);
      console.log(res.data);
      if (res.data.success) {
        return res.data.leaveType;
      }

      return null;
    } catch (error) {
      console.error("Error creating leave type:", error);
      toast.error(
        error.response?.data?.message || "Failed to create leave type"
      );
      throw error;
    }
  },

  updateLeaveType: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/masters/leavetypes/${id}`, data);
      console.log(res.data);
      if (res.data.success) {
        return res.data.leaveType;
      }

      return null;
    } catch (error) {
      console.error("Error updating leave type:", error);
      toast.error(
        error.response?.data?.message || "Failed to update leave type"
      );
      throw error;
    }
  },

  deleteLeaveType: async (id) => {
    try {
      const res = await axiosInstance.delete(`/masters/leavetypes/${id}`);

      if (res.data.success) {
        return res.data.leaveType;
      }

      return null;
    } catch (error) {
      console.error("Error deleting bank details:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete bank details"
      );
      throw error;
    }
  },

  leadReference: [],

  // GET ALL
  getAllLeadReference: async () => {
    try {
      const res = await axiosInstance.get("/masters/lead-references");

      if (res.data.success) {
        set({ leadReference: res.data.references });
      }
    } catch (error) {
      console.error("Error fetching lead references:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch lead references"
      );
    }
  },

  // CREATE
  createLeadReference: async (data) => {
    try {
      const res = await axiosInstance.post("/masters/lead-references", data);

      if (res.data.success) {
        set((state) => ({
          leadReference: [...state.leadReference, res.data.reference],
        }));
      }
    } catch (error) {
      console.error("Error creating lead references:", error);
      toast.error(
        error.response?.data?.message || "Failed to create lead reference"
      );
    }
  },

  // UPDATE
  updateLeadReference: async (id, data) => {
    try {
      const res = await axiosInstance.put(
        `/masters/lead-references/${id}`,
        data
      );

      if (res.data.success) {
        set((state) => ({
          leadReference: state.leadReference.map((reference) =>
            reference._id === id ? res.data.reference : reference
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating lead references:", error);
      toast.error(
        error.response?.data?.message || "Failed to update lead reference"
      );
    }
  },

  // DELETE
  deleteLeadReference: async (id) => {
    try {
      const res = await axiosInstance.delete(`/masters/lead-references/${id}`);

      if (res.data.success) {
        set((state) => ({
          leadReference: state.leadReference.filter(
            (reference) => reference._id !== id
          ),
        }));
      }
    } catch (error) {
      console.error("Error deleting lead references:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete lead reference"
      );
    }
  },

  leadStatuses: [],

  // GET ALL
  getAllLeadStatuses: async () => {
    try {
      const res = await axiosInstance.get("/masters/lead-status");

      if (res.data.success) {
        set({ leadStatuses: res.data.leadStatuses });
      }
    } catch (error) {
      console.error("Error fetching lead status:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch lead status"
      );
    }
  },

  // CREATE
  createLeadStatus: async (data) => {
    try {
      const res = await axiosInstance.post("/masters/lead-status", data);

      if (res.data.success) {
        set((state) => ({
          leadStatuses: [...state.leadStatuses, res.data.leadStatus],
        }));
      }
    } catch (error) {
      console.error("Error creating lead status:", error);
      toast.error(
        error.response?.data?.message || "Failed to create lead status"
      );
    }
  },

  // UPDATE
  updateLeadStatus: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/masters/lead-status/${id}`, data);

      if (res.data.success) {
        set((state) => ({
          leadStatuses: state.leadStatuses.map((status) =>
            status._id === id ? res.data.leadStatus : status
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating lead status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update lead status"
      );
    }
  },

  // DELETE
  deleteLeadStatus: async (id) => {
    try {
      const res = await axiosInstance.delete(`/masters/lead-status/${id}`);

      if (res.data.success) {
        set((state) => ({
          leadStatuses: state.leadStatuses.filter(
            (status) => status._id !== id
          ),
        }));
      }
    } catch (error) {
      console.error("Error deleting lead status:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete lead status"
      );
    }
  },

  departments: [],
  getAllDepartments: async () => {
    try {
      const res = await axiosInstance.get("/masters/departments");
      if (res.data.success) {
        set({ departments: res.data.departments });
      }
      return res.data.departments;
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch departments"
      );
    }
  },

  createDepartment: async (name) => {
    try {
      const res = await axiosInstance.post("/masters/departments", { name });

      set((state) => ({
        departments: [res.data.department, ...state.departments],
      }));
      return res.data.department;
    } catch (error) {
      console.error("Error creating department:", error);
      toast.error(
        error.response?.data?.message || "Failed to create department"
      );
    }
  },

  updateDepartment: async (id, name) => {
    try {
      const res = await axiosInstance.put(`/masters/departments/${id}`, {
        name,
      });

      set((state) => ({
        departments: state.departments.map((department) =>
          department._id === id ? res.data.department : department
        ),
      }));
      return res.data.department;
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error(
        error.response?.data?.message || "Failed to update department"
      );
    }
  },

  deleteDepartment: async (id) => {
    try {
      const res = await axiosInstance.delete(`/masters/departments/${id}`);

      set((state) => ({
        departments: state.departments.filter(
          (department) => department._id !== id
        ),
      }));
      return res.data.department;
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete department"
      );
    }
  },

  positions: [],
  getAllPositions: async () => {
    try {
      const res = await axiosInstance.get("/masters/positions");

      if (res.data.success) {
        set({ positions: res.data.positions });
      }
      return res.data.positions;
    } catch (error) {
      console.error("Error fetching positions:", error);
      toast.error(error.response?.data?.message || "Failed to fetch positions");
    }
  },

  createPosition: async (name) => {
    try {
      const res = await axiosInstance.post("/masters/positions", { name });

      set((state) => ({
        positions: [res.data.position, ...state.positions],
      }));
      return res.data.position;
    } catch (error) {
      console.error("Error creating position:", error);
      toast.error(error.response?.data?.message || "Failed to create position");
    }
  },

  updatePosition: async (id, name) => {
    try {
      const res = await axiosInstance.put(`/masters/positions/${id}`, { name });

      set((state) => ({
        positions: state.positions.map((position) =>
          position._id === id ? res.data.position : position
        ),
      }));
      return res.data.position;
    } catch (error) {
      console.error("Error updating position:", error);
      toast.error(error.response?.data?.message || "Failed to update position");
    }
  },

  deletePosition: async (id) => {
    try {
      const res = await axiosInstance.delete(`/masters/positions/${id}`);

      set((state) => ({
        positions: state.positions.filter((position) => position._id !== id),
      }));
      return res.data.position;
    } catch (error) {
      console.error("Error deleting position:", error);
      toast.error(error.response?.data?.message || "Failed to delete position");
    }
  },

  taskStatuses: [],

  // GET ALL
  getAllTaskStatus: async () => {
    try {
      const res = await axiosInstance.get("/masters/task-status");

      if (res.data.success) {
        set({ taskStatuses: res.data.taskStatuses });
      }
    } catch (error) {
      console.error("Error fetching task status:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch task status"
      );
    }
  },

  // CREATE
  createTaskStatus: async (data) => {
    try {
      const res = await axiosInstance.post("/masters/task-status", data);

      if (res.data.success) {
        set((state) => ({
          taskStatuses: [...state.taskStatuses, res.data.taskStatus],
        }));
      }
    } catch (error) {
      console.error("Error creating task status:", error);
      toast.error(
        error.response?.data?.message || "Failed to create task status"
      );
    }
  },

  // UPDATE
  updateTaskStatus: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/masters/task-status/${id}`, data);

      if (res.data.success) {
        set((state) => ({
          taskStatuses: state.taskStatuses.map((status) =>
            status._id === id ? res.data.taskStatus : status
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update task status"
      );
    }
  },

  // DELETE
  deleteTaskStatus: async (id) => {
    try {
      const res = await axiosInstance.delete(`/masters/task-status/${id}`);

      if (res.data.success) {
        set((state) => ({
          taskStatuses: state.taskStatuses.filter(
            (status) => status._id !== id
          ),
        }));
      }
    } catch (error) {
      console.error("Error deleting task status:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete task status"
      );
    }
  },

  priorities: [],

  // GET ALL
  getAllPriorities: async () => {
    try {
      const res = await axiosInstance.get("/masters/priorities");

      if (res.data.success) {
        set({ priorities: res.data.priorities });
      }
    } catch (error) {
      console.error("Error fetching priorities:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch priorities"
      );
    }
  },

  // CREATE
  createPriority: async (priority) => {
    try {
      const res = await axiosInstance.post("/masters/priorities", { priority });

      if (res.data.success) {
        set((state) => ({
          priorities: [...state.priorities, res.data.priority],
        }));
      }
    } catch (error) {
      console.error("Error creating priority:", error);
      toast.error(error.response?.data?.message || "Failed to create priority");
    }
  },

  // UPDATE
  updatePriority: async (id, priority) => {
    try {
      const res = await axiosInstance.put(`/masters/priorities/${id}`, {
        priority,
      });

      if (res.data.success) {
        set((state) => ({
          priorities: state.priorities.map((p) =>
            p._id === id ? res.data.priority : p
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating priority:", error);
      toast.error(error.response?.data?.message || "Failed to update priority");
    }
  },

  // DELETE
  deletePriority: async (id) => {
    try {
      const res = await axiosInstance.delete(`/masters/priorities/${id}`);

      if (res.data.success) {
        set((state) => ({
          priorities: state.priorities.filter((p) => p._id !== id),
        }));
      }
    } catch (error) {
      console.error("Error deleting priority:", error);
      toast.error(error.response?.data?.message || "Failed to delete priority");
    }
  },

  holidays: [],

  // GET ALL
  getAllHolidays: async () => {
    try {
      const res = await axiosInstance.get("/masters/holidays");

      if (res.data.success) {
        set({ holidays: res.data.holidays });
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
      toast.error(error.response?.data?.message || "Failed to fetch holiday");
    }
  },

  // CREATE
  createHoliday: async (data) => {
    try {
      const res = await axiosInstance.post("/masters/holidays", data);

      if (res.data.success) {
        set((state) => ({
          holidays: [...state.holidays, res.data.holiday],
        }));
      }
    } catch (error) {
      console.error("Error creating holiday:", error);
      toast.error(error.response?.data?.message || "Failed to create holiday");
    }
  },

  // UPDATE
  updateHoliday: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/masters/holidays/${id}`, data);

      if (res.data.success) {
        set((state) => ({
          holidays: state.holidays.map((holiday) =>
            holiday._id === id ? res.data.holiday : holiday
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating holiday:", error);
      toast.error(error.response?.data?.message || "Failed to update holiday");
    }
  },

  // DELETE
  deleteHoliday: async (id) => {
    try {
      const res = await axiosInstance.delete(`/masters/holidays/${id}`);

      if (res.data.success) {
        set((state) => ({
          holidays: state.holidays.filter((holiday) => holiday._id !== id),
        }));
      }
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast.error(error.response?.data?.message || "Failed to delete holiday");
    }
  },

  holidayTypes: [],

  // GET ALL
  getAllHolidayTypes: async () => {
    try {
      const res = await axiosInstance.get("/masters/holiday-types");

      if (res.data.success) {
        set({ holidayTypes: res.data.holidayTypes });
      }
    } catch (error) {
      console.error("Error fetching holidayTypes:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch holidayTypes"
      );
    }
  },

  // CREATE
  createHolidayType: async (data) => {
    try {
      const res = await axiosInstance.post("/masters/holiday-types", data);

      if (res.data.success) {
        set((state) => ({
          holidayTypes: [...state.holidayTypes, res.data.holidayType],
        }));
      }
    } catch (error) {
      console.error("Error creating holidayType:", error);
      toast.error(
        error.response?.data?.message || "Failed to create holidayType"
      );
    }
  },

  // UPDATE
  updateHolidayType: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/masters/holiday-types/${id}`, data);

      if (res.data.success) {
        set((state) => ({
          holidayTypes: state.holidayTypes.map((holidayType) =>
            holidayType._id === id ? res.data.holidayType : holidayType
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating holidayType:", error);
      toast.error(
        error.response?.data?.message || "Failed to update holidayType"
      );
    }
  },

  // DELETE
  deleteHolidayType: async (id) => {
    try {
      const res = await axiosInstance.delete(`/masters/holiday-types/${id}`);

      if (res.data.success) {
        set((state) => ({
          holidayTypes: state.holidayTypes.filter(
            (holidayType) => holidayType._id !== id
          ),
        }));
      }
    } catch (error) {
      console.error("Error deleting holidayType:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete holidayType"
      );
    }
  },

  expenses: [],

  // Get all expenses
  getAllExpenses: async (filters = {}) => {
    try {
      const res = await axiosInstance.get("/expenses", { params: filters });

      if (res.data.success) {
        const { expenses, total, page, totalPages } = res.data;

        // Update Zustand state
        if (!filters.forPadf) {
          set({ expenses });
        }
        // Also return values if you want to use them immediately
        return { expenses, total, currentPage: page, totalPages };
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error(error.response?.data?.message || "Failed to fetch expenses");
      return { expenses: [], total: 0, page: 1, totalPages: 1 };
    }
  },
  // Create a new expense (multipart)
  createExpense: async (expenseData) => {
    try {
      const res = await axiosInstance.post("/expenses", expenseData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("expense created successfully");
        set((state) => ({
          expenses: [res.data.expense, ...state.expenses],
        }));
      }
    } catch (error) {
      console.error("Error creating expense:", error);
      toast.error(error.response?.data?.message || "Failed to create expense");
      throw error;
    }
  },

  // Update expense by ID (multipart)
  updateExpense: async (id, expenseData) => {
    try {
      const res = await axiosInstance.put(`/expenses/${id}`, expenseData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("expense updated successfully");
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense._id === id ? res.data.expense : expense
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error(error.response?.data?.message || "Failed to update expense");
      throw error;
    }
  },

  // Delete expense by ID
  deleteExpense: async (id) => {
    try {
      const res = await axiosInstance.delete(`/expenses/${id}`);
      if (res.data.success) {
        toast.success("expense deleted successfully");
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense._id !== id),
        }));
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error(error.response?.data?.message || "Failed to delete expense");
    }
  },

  getExpenseStats: async ({ month }) => {
    console.log(month);
    try {
      const res = await axiosInstance.get("/expenses/stats", {
        params: { month }, // ✅ FIXED
      });

      if (res.data.success) {
        const { totalExpenses, totalGST, grandTotal, totalEntries } = res.data;

        console.log(totalExpenses, totalGST, grandTotal, totalEntries);

        return {
          totalExpenses,
          totalGST,
          grandTotal,
          totalEntries,
        };
      }
    } catch (error) {
      console.error("Error fetching expense stats:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch expense statistics"
      );

      return {
        totalExpenses: 0,
        totalGST: 0,
        grandTotal: 0,
        totalEntries: 0,
      };
    }
  },

  contacts: [],

  // Get all contacts
  getAllContacts: async (filters = {}) => {
    try {
      const res = await axiosInstance.get("/contacts", { params: filters });

      if (res.data.success) {
        const { contacts, total, page, totalPages } = res.data;

        // Update Zustand state
        if (!filters.forPadf) {
          set({ contacts });
        }
        // Also return values if you want to use them immediately
        return { contacts, total, currentPage: page, totalPages };
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error(error.response?.data?.message || "Failed to fetch contacts");
      return { contacts: [], total: 0, page: 1, totalPages: 1 };
    }
  },
  // Create a new contact
  createContact: async (contactData) => {
    try {
      const res = await axiosInstance.post("/contacts", contactData);

      if (res.data.success) {
        toast.success("contact created successfully");
        set((state) => ({
          contacts: [res.data.contact, ...state.contacts],
        }));
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      toast.error(error.response?.data?.message || "Failed to create contact");
      throw error;
    }
  },

  // Update contact by ID
  updateContact: async (id, contactData) => {
    try {
      const res = await axiosInstance.put(`/contacts/${id}`, contactData);

      if (res.data.success) {
        toast.success("contact updated successfully");
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact._id === id ? res.data.contact : contact
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error(error.response?.data?.message || "Failed to update contact");
      throw error;
    }
  },

  // Delete contact by ID
  deleteContact: async (id) => {
    try {
      const res = await axiosInstance.delete(`/contacts/${id}`);
      if (res.data.success) {
        toast.success("contact deleted successfully");
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact._id !== id),
        }));
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error(error.response?.data?.message || "Failed to delete contact");
    }
  },

  domains: [],

  // Get all domains
  getAllDomains: async (filters = {}) => {
    try {
      const res = await axiosInstance.get("/domains", { params: filters });

      if (res.data.success) {
        const { domains, total, page, totalPages } = res.data;

        // Update Zustand state
        if (!filters.forPadf) {
          set({ domains });
        }
        // Also return values if you want to use them immediately
        return { domains, total, currentPage: page, totalPages };
      }
    } catch (error) {
      console.error("Error fetching domains:", error);
      toast.error(error.response?.data?.message || "Failed to fetch domains");
      return { domains: [], total: 0, page: 1, totalPages: 1 };
    }
  },
  // Create a new domain
  createDomain: async (domainData) => {
    try {
      const res = await axiosInstance.post("/domains", domainData);

      if (res.data.success) {
        toast.success("domain created successfully");
        set((state) => ({
          domains: [res.data.domain, ...state.domains],
        }));
      }
    } catch (error) {
      console.error("Error creating domain:", error);
      toast.error(error.response?.data?.message || "Failed to create domain");
      throw error;
    }
  },

  // Update domain by ID
  updateDomain: async (id, domainData) => {
    try {
      console.log("4");
      console.log(domainData);
      const res = await axiosInstance.put(`/domains/${id}`, domainData);

      if (res.data.success) {
        toast.success("domain updated successfully");
        set((state) => ({
          domains: state.domains.map((domain) =>
            domain._id === id ? res.data.domain : domain
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating domain:", error);
      toast.error(error.response?.data?.message || "Failed to update domain");
      throw error;
    }
  },

  // Delete domain by ID
  deleteDomain: async (id) => {
    try {
      const res = await axiosInstance.delete(`/domains/${id}`);
      if (res.data.success) {
        toast.success("domain deleted successfully");
        set((state) => ({
          domains: state.domains.filter((domain) => domain._id !== id),
        }));
      }
    } catch (error) {
      console.error("Error deleting domain:", error);
      toast.error(error.response?.data?.message || "Failed to delete contact");
    }
  },

  inventories: [],

  // Get all inventories
  getAllInventories: async (filters = {}) => {
    try {
      const res = await axiosInstance.get("/inventories", { params: filters });

      if (res.data.success) {
        const { inventories, stats, total, page, totalPages } = res.data;

        if (!filters.forPadf) {
          set({ inventories: inventories || [] });
        }

        return { inventories, stats, total, currentPage: page, totalPages };
      }
    } catch (error) {
      console.error("Error fetching inventories:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch inventories"
      );

      // Prevent UI crash
      if (!filters.forPadf) {
        set({ inventories: [] });
      }

      return { inventories: [], total: 0, currentPage: 1, totalPages: 1 };
    }
  },

  // Create a new inventory
  createInventory: async (inventoryData) => {
    try {
      const res = await axiosInstance.post("/inventories", inventoryData);

      if (res.data.success) {
        toast.success("inventory created successfully");
        set((state) => ({
          inventories: [res.data.inventory, ...state.inventories],
        }));
      }
    } catch (error) {
      console.error("Error creating inventory:", error);
      toast.error(
        error.response?.data?.message || "Failed to create inventory"
      );
      throw error;
    }
  },

  // Update inventory by ID
  updateInventory: async (id, inventoryData) => {
    try {
      const res = await axiosInstance.put(`/inventories/${id}`, inventoryData);

      if (res.data.success) {
        toast.success("inventory updated successfully");
        set((state) => ({
          inventories: state.inventories.map((inventory) =>
            inventory._id === id ? res.data.inventory : inventory
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast.error(
        error.response?.data?.message || "Failed to update inventory"
      );
      throw error;
    }
  },

  // Delete inventory by ID
  deleteInventory: async (id) => {
    try {
      const res = await axiosInstance.delete(`/inventories/${id}`);
      if (res.data.success) {
        toast.success("inventory deleted successfully");
        set((state) => ({
          inventories: state.inventories.filter(
            (inventory) => inventory._id !== id
          ),
        }));
      }
    } catch (error) {
      console.error("Error deleting inventory:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete inventory"
      );
    }
  },

  admins: [],

  // Get all admins
  getAllAdmins: async (filters = {}) => {
    try {
      const res = await axiosInstance.get("/admins", { params: filters });

      if (res.data.success) {
        const { admins, total, page, totalPages } = res.data;

        set({ admins: admins || [] });

        return { admins, total, currentPage: page, totalPages };
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error(error.response?.data?.message || "Failed to fetch admins");

      // Prevent UI crash

      set({ admins: [] });

      return { admins: [], total: 0, currentPage: 1, totalPages: 1 };
    }
  },

  // Create a new admin
  createAdmin: async (adminData) => {
    try {
      const res = await axiosInstance.post("/admins", adminData);

      if (res.data.success) {
        toast.success("admin created successfully");
        set((state) => ({
          admins: [res.data.admin, ...state.admins],
        }));
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error(error.response?.data?.message || "Failed to create admin");
      throw error;
    }
  },

  // Update admin by ID
  updateAdmin: async (id, adminData) => {
    try {
      const res = await axiosInstance.put(`/admins/${id}`, adminData);

      if (res.data.success) {
        toast.success("admin updated successfully");
        set((state) => ({
          admins: state.admins.map((admin) =>
            admin._id === id ? res.data.admin : admin
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error(error.response?.data?.message || "Failed to update admin");
      throw error;
    }
  },

  // Delete admin by ID
  deleteAdmin: async (id) => {
    try {
      const res = await axiosInstance.delete(`/admins/${id}`);
      if (res.data.success) {
        toast.success("admin deleted successfully");
        set((state) => ({
          admins: state.admins.filter((admin) => admin._id !== id),
        }));
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error(error.response?.data?.message || "Failed to delete admin");
    }
  },
}));

export default useAdminStore;
