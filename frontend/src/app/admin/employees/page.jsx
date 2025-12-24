"use client";

import { useEffect, useState } from "react";
import {
  Search,
  PlusCircle,
  UserCheck,
  UserX,
  X,
  Edit,
  Eye,
  Trash2,
  Clock,
} from "lucide-react";
import useAdminStore from "@/stores/useAdminStore";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);
  const [showViewSidebar, setShowViewSidebar] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);

  const {
    employees,
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    departments,
    getAllDepartments,
    positions,
    getAllPositions,
  } = useAdminStore();

  const [newEmployee, setNewEmployee] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    status: "Active",
    password: "",
    joinDate: "",
    address: "",
    salary: "",
  });

  const [editingEmployee, setEditingEmployee] = useState({
    _id: "",
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    status: "Active",
    password: "",
    joinDate: "",
    address: "",
    salary: "",
  });
  const handleAddEmployee = async () => {
    if (
      !newEmployee.name ||
      !newEmployee.email ||
      !newEmployee.employeeId ||
      !newEmployee.password
    ) {
      alert("name email employeeId and password are required fields.");
      return;
    }
    try {
      setIsLoading(true);
      await createEmployee(newEmployee);
      setNewEmployee({
        employeeId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        status: "Active",
        password: "",
        joinDate: "",
        address: "",
        salary: "",
      });
      setShowAddSidebar(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEmployee = async () => {
    if (
      !editingEmployee.name ||
      !editingEmployee.email ||
      !editingEmployee.employeeId
    ) {
      alert("name email and employeeId are required fields.");
      return;
    }
    try {
      setIsLoading(true);
      await updateEmployee(editingEmployee._id, editingEmployee);
      setShowEditSidebar(false);
      setEditingEmployee(null);
      setIsLoading(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = (employee) => {
    setDeletingEmployee(employee);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!deletingEmployee) return;
    try {
      setIsLoading(true);
      await deleteEmployee(deletingEmployee._id);
      setShowDeletePopup(false);
      setDeletingEmployee(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewEmployee = (employee) => {
    setViewingEmployee(employee);
    setShowViewSidebar(true);
  };

  const handleEditClick = (employee) => {
    setEditingEmployee({
      _id: employee._id || "",
      employeeId: employee.employeeId || "",
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      // department/position might be populated objects or just ids
      department: employee.department?._id || "",
      position: employee.position?._id || "",
      status: employee.status || "Active",
      password: "", // never populate existing hash
      joinDate: employee.joinDate
        ? new Date(employee.joinDate).toISOString().slice(0, 10)
        : "",
      address: employee.address || "",
      salary:
        employee.salary !== undefined && employee.salary !== null
          ? employee.salary
          : "",
    });

    setShowEditSidebar(true);
  };

  const clearFilters = () => {
    setSearch("");
    setDepartmentFilter("");
    setStatusFilter("");
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setFetching(true);
        const { employees, total, currentPage, totalPages } =
          await getAllEmployees({
            page,
            limit,
            search,
            departmentFilter,
            statusFilter,
          });
        setPage(currentPage);
        setTotal(total);
        setTotalPages(totalPages);
      } catch (error) {
      } finally {
        setFetching(false);
      }
    };
    fetchEmployees();
  }, [page, limit, search, departmentFilter, statusFilter]);

  useEffect(() => {
    getAllDepartments();
    getAllPositions();
  }, []);

  return (
    <div className="p-1 space-y-2  min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage all company employees and their details
          </p>
        </div>
        <button
          onClick={() => {
            setNewEmployee({
              employeeId: "",
              name: "",
              email: "",
              phone: "",
              department: "",
              position: "",
              status: "Active",
              password: "",
              joinDate: "",
              address: "",
              salary: "",
            });
            setShowAddSidebar(true);
          }}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold flex items-center gap-2 px-4 py-2.5 rounded-lg transition"
        >
          <PlusCircle size={20} /> Add Employee
        </button>
      </div>

      {/* Search and Filters - One Line */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            autoComplete="off" // ✅ completely disables browser autofill
            name="employee-search" // ✅ unique name so Chrome won't confuse with login/email fields
            inputMode="search"
            className="bg-transparent border-0 focus:outline-none text-sm flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border w-full border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none bg-white"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border w-full border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none bg-white"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="On Leave">On Leave</option>
        </select>

        <button
          onClick={clearFilters}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Clear
        </button>
      </div>

      {/* Employee Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">EmployeeID</th>
                <th className="px-6 py-4">Employee Details</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr
                  key={emp._id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    {/* <img
                      src={emp.avatar || "/placeholder.svg"}
                      alt={emp.name}
                      className="h-10 w-10 rounded-full object-cover"
                    /> */}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {emp.employeeId}
                      </p>
                    </div>
                  </td>
                  <td>
                    <p className="text-xs text-gray-500">{emp.name}</p>
                  </td>
                  <td>
                    <p className="text-xs text-gray-500">{emp.email}</p>
                    <p className="text-xs text-gray-500">{emp.phone}</p>
                  </td>
                  <td className="px-6 py-4">{emp.department?.name}</td>
                  <td className="px-6 py-4">
                    {emp.status === "Active" && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        <UserCheck size={14} /> Active
                      </span>
                    )}
                    {emp.status === "Inactive" && (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        <UserX size={14} /> Inactive
                      </span>
                    )}
                    {emp.status === "On Leave" && (
                      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        <Clock size={14} /> On Leave
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewEmployee(emp)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditClick(emp)}
                        className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(emp)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employees.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">No employees found</p>
            <p className="text-sm">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>

      {/* Add Employee Sidebar */}
      {showAddSidebar && (
        <>
          <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div
              className="fixed inset-0 bg-black/40 "
              onClick={() => setShowAddSidebar(false)}
            />
            <div className="lg:h-150 md:h-100 md:w-300 h-130 w-full md:p-5 p-3 m-4 overflow-hidden  justify-center items-center z-30   bg-white shadow-2xl overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Add Employee
                  </h2>
                  <button
                    onClick={() => setShowAddSidebar(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Loading Skeleton */}
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-10 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid lg:grid-cols-2 gap-3">
                      {/* Employee ID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employee ID
                        </label>
                        <input
                          type="text"
                          placeholder="EMP001"
                          value={newEmployee.employeeId}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              employeeId: e.target.value,
                            })
                          }
                          autoComplete="off" // ✅ prevent Chrome autofill
                          name="employee-id" // ✅ unique name
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>

                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={newEmployee.name}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              name: e.target.value,
                            })
                          }
                          autoComplete="off"
                          name="employee-name"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-3">
                      {/* Email Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          placeholder="john@company.com"
                          value={newEmployee.email}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              email: e.target.value,
                            })
                          }
                          autoComplete="off" // ✅ disables email autofill
                          name="employee-email"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={newEmployee.phone}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              phone: e.target.value,
                            })
                          }
                          autoComplete="off"
                          name="employee-phone"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-3">
                      {/* Department */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <select
                          value={newEmployee.department}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              department: e.target.value,
                            })
                          }
                          autoComplete="off"
                          name="employee-department"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept._id} value={dept._id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Position */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Position
                        </label>
                        <select
                          value={newEmployee.position}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              position: e.target.value,
                            })
                          }
                          autoComplete="off"
                          name="employee-position"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="">Select Position</option>
                          {positions.map((pos) => (
                            <option key={pos._id} value={pos._id}>
                              {pos.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Join Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Join Date
                      </label>
                      <input
                        type="date"
                        value={newEmployee.joinDate}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            joinDate: e.target.value,
                          })
                        }
                        autoComplete="off"
                        name="employee-join-date"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        rows="3"
                        placeholder="123 Street, City, Country"
                        value={newEmployee.address}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            address: e.target.value,
                          })
                        }
                        autoComplete="off"
                        name="employee-address"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                      />
                    </div>

                    {/* Salary */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary
                      </label>
                      <input
                        type="number"
                        placeholder="50000"
                        value={newEmployee.salary}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            salary: e.target.value,
                          })
                        }
                        autoComplete="off"
                        name="employee-salary"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter password"
                        value={newEmployee.password}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            password: e.target.value,
                          })
                        }
                        autoComplete="new-password" // ✅ this stops Chrome from filling saved login passwords
                        name="employee-password"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={newEmployee.status}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            status: e.target.value,
                          })
                        }
                        autoComplete="off"
                        name="employee-status"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowAddSidebar(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEmployee}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save Employee"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Employee Sidebar */}
      {showEditSidebar && editingEmployee && (
        <>
          <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div
              className="fixed inset-0 bg-black/40 "
              onClick={() => setShowEditSidebar(false)}
            />
            <div className="lg:h-150 md:h-100 md:w-300 h-130 w-full md:p-5 p-3 m-4 overflow-hidden  justify-center items-center z-30   bg-white shadow-2xl overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Employee
                  </h2>
                  <button
                    onClick={() => setShowEditSidebar(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Loading Skeleton */}
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-10 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Employee ID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employee ID
                        </label>
                        <input
                          type="text"
                          value={editingEmployee.employeeId}
                          onChange={(e) =>
                            setEditingEmployee({
                              ...editingEmployee,
                              employeeId: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        />
                      </div>

                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editingEmployee.name}
                          onChange={(e) =>
                            setEditingEmployee({
                              ...editingEmployee,
                              name: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editingEmployee.email}
                          onChange={(e) =>
                            setEditingEmployee({
                              ...editingEmployee,
                              email: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={editingEmployee.phone}
                          onChange={(e) =>
                            setEditingEmployee({
                              ...editingEmployee,
                              phone: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Department */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <select
                          value={editingEmployee.department}
                          onChange={(e) =>
                            setEditingEmployee({
                              ...editingEmployee,
                              department: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept._id} value={dept._id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Position */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Position
                        </label>
                        <select
                          value={editingEmployee.position}
                          onChange={(e) =>
                            setEditingEmployee({
                              ...editingEmployee,
                              position: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        >
                          <option value="">Select Position</option>
                          {positions.map((pos) => (
                            <option key={pos._id} value={pos._id}>
                              {pos.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Join Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Join Date
                      </label>
                      <input
                        type="date"
                        value={editingEmployee.joinDate}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            joinDate: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        rows="3"
                        value={editingEmployee.address}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            address: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00aeef] resize-none"
                      />
                    </div>

                    {/* Salary */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary
                      </label>
                      <input
                        type="number"
                        value={editingEmployee.salary}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            salary: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password (optional)"
                        value={editingEmployee.password}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            password: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={editingEmployee.status}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            status: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowEditSidebar(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditEmployee}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-[#00aeef] hover:bg-[#00aeef] text-white font-medium rounded-lg transition disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Update Employee"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* View Employee Sidebar */}
      {showViewSidebar && viewingEmployee && (
        <>
          <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div
              className="fixed inset-0 bg-black/40 "
              onClick={() => setShowViewSidebar(false)}
            />
            <div className="lg:h-150 md:h-100 md:w-250 rounded-md h-130 w-full md:p-5 p-3 m-4 overflow-hidden  justify-center items-center z-30   bg-white shadow-2xl overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex w-full justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Employee Details
                  </h2>
                  {/* <button
                    onClick={() => setShowViewSidebar(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X size={20} />
                  </button> */}
                  <div className="flex gap-5">
                    <button
                      onClick={() => {
                        setShowViewSidebar(false);
                        handleEditClick(viewingEmployee);
                      }}
                      className="  py-2.5  text-[#00aeef] font-medium rounded-lg hover:bg-amber-50 transition"
                    >
                      <Edit size={18} className="inline mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteEmployee(viewingEmployee._id);
                        setShowViewSidebar(false);
                      }}
                      className="flex-1  py-2.5 text-red-600 font-medium rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 size={18} className="inline mr-2" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Profile Card */}
                <div className="border p-4 rounded-md  flex justify-between">
                  <div className="flex gap-3 items-center">
                    <div>
                      <img
                        src="https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent.png"
                        alt=""
                        className="h-12 w-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {viewingEmployee.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {viewingEmployee.position?.name}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="mt-2">
                      {viewingEmployee.status === "Active" && (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <UserCheck size={14} /> Active
                        </span>
                      )}
                      {viewingEmployee.status === "Inactive" && (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <UserX size={14} /> Inactive
                        </span>
                      )}
                      {viewingEmployee.status === "On Leave" && (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <Clock size={14} /> On Leave
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-6 border rounded-lg p-4">
                  <div className="grid lg:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        EMPLOYEE ID
                      </p>
                      <p className="text-sm text-gray-900 bg-[#f8f8f8e4] mt-1 border p-3 rounded-sm">
                        {viewingEmployee.employeeId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </p>
                      <p className="text-sm text-gray-900 bg-[#f8f8f8e4] mt-1 border p-3 rounded-sm">
                        {viewingEmployee.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Phone
                      </p>
                      <p className="text-sm text-gray-900 bg-[#f8f8f8e4] mt-1 border p-3 rounded-sm">
                        {viewingEmployee.phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Department
                      </p>
                      <p className="text-sm text-gray-900 bg-[#f8f8f8e4] mt-1 border p-3 rounded-sm">
                        {viewingEmployee.department?.name}
                      </p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Join Date
                      </p>
                      <p className="text-sm text-gray-900 bg-[#f8f8f8e4] mt-1 border p-3 rounded-sm">
                        {viewingEmployee.joinDate?.slice(0, 10)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Salary
                      </p>
                      <p className="text-sm text-gray-900 bg-[#f8f8f8e4] mt-1 border p-3 rounded-sm">
                        {viewingEmployee.salary ? viewingEmployee.salary : "0"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Address
                      </p>
                      <p className="text-sm text-gray-900 bg-[#f8f8f8e4] mt-1 border p-3 rounded-sm">
                        {viewingEmployee.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && deletingEmployee && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 transition-opacity"
            onClick={() => setShowDeletePopup(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-red-100 text-red-600 p-3 rounded-full">
                    <Trash2 size={28} />
                  </div>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Delete Employee?
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Are you sure you want to permanently remove{" "}
                  <span className="font-medium text-gray-900">
                    {deletingEmployee.name}
                  </span>{" "}
                  from the system? This action cannot be undone.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
