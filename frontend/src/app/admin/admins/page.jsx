"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Eye, EyeOff, X } from "lucide-react";
import useAdminStore from "@/stores/useAdminStore";

// System modules hierarchy
const MODULES = [
  {
    id: 1,
    name: "All",
    level: 0,
    category: null,
    children: [
      {
        id: 2,
        name: "CORE",
        level: 0,
        category: "CORE",
        children: [
          {
            id: 2.1,
            name: "Dashboard",
            level: 1,
            category: "CORE",
            children: [],
          },
          {
            id: 2.2,
            name: "Masters",
            level: 1,
            category: "CORE",
            children: [
              {
                id: 2.21,
                name: "Bank Details",
                level: 2,
                category: "CORE",
                children: [],
              },
              {
                id: 2.22,
                name: "Product Category",
                level: 2,
                category: "CORE",
                children: [],
              },
              {
                id: 2.23,
                name: "Leave Type",
                level: 2,
                category: "CORE",
                children: [],
              },
              {
                id: 2.24,
                name: "Lead Reference",
                level: 2,
                category: "CORE",
                children: [],
              },
              {
                id: 2.25,
                name: "Lead Status",
                level: 2,
                category: "CORE",
                children: [],
              },
              {
                id: 2.26,
                name: "Holiday",
                level: 2,
                category: "CORE",
                children: [],
              },
              {
                id: 2.27,
                name: "Position",
                level: 2,
                category: "CORE",
                children: [],
              },
              {
                id: 2.28,
                name: "Department",
                level: 2,
                category: "CORE",
                children: [],
              },
              {
                id: 2.29,
                name: "Task Status",
                level: 2,
                category: "CORE",
                children: [],
              },
              {
                id: 2.3,
                name: "Priority",
                level: 2,
                category: "CORE",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 3,
        name: "CRM / BUSINESS OPERATIONS",
        level: 0,
        category: "CRM",
        children: [
          { id: 3.1, name: "Leads", level: 1, category: "CRM", children: [] },
          { id: 3.2, name: "Clients", level: 1, category: "CRM", children: [] },
          {
            id: 3.3,
            name: "Domain Manager",
            level: 1,
            category: "CRM",
            children: [],
          },
          {
            id: 3.4,
            name: "Address Book",
            level: 1,
            category: "CRM",
            children: [],
          },
          {
            id: 3.5,
            name: "Meetings",
            level: 1,
            category: "CRM",
            children: [],
          },
        ],
      },
      {
        id: 4,
        name: "HUMAN RESOURCES (HR)",
        level: 0,
        category: "HR",
        children: [
          { id: 4.1, name: "Admins", level: 1, category: "HR", children: [] },
          {
            id: 4.2,
            name: "Employees",
            level: 1,
            category: "HR",
            children: [],
          },
          {
            id: 4.3,
            name: "Attendance",
            level: 1,
            category: "HR",
            children: [],
          },
          { id: 4.4, name: "Leaves", level: 1, category: "HR", children: [] },
          {
            id: 4.5,
            name: "Tasks",
            level: 1,
            category: "HR",
            children: [
              {
                id: 4.51,
                name: "All Tasks",
                level: 2,
                category: "HR",
                children: [],
              },
              {
                id: 4.52,
                name: "View Summary",
                level: 2,
                category: "HR",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 5,
        name: "FINANCE & ACCOUNTING",
        level: 0,
        category: "FINANCE",
        children: [
          {
            id: 5.1,
            name: "Invoices & Payments",
            level: 1,
            category: "FINANCE",
            children: [],
          },
          {
            id: 5.2,
            name: "Expenses",
            level: 1,
            category: "FINANCE",
            children: [],
          },
          {
            id: 5.3,
            name: "Inventory",
            level: 1,
            category: "FINANCE",
            children: [],
          },
        ],
      },
    ],
  },
];

const ACTIONS = ["Add", "View", "Edit", "Delete"];

// Admin form component
function AdminForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          password: "",
          permissions: initialData.permissions,
        }
      : {
          name: "",
          email: "",
          password: "",
          permissions: "",
        }
  );
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!initialData && !formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      // setFormData({ name: "", email: "", password: "" });
      // setErrors({});
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {initialData ? "Edit Admin" : "Add New Admin"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter admin name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {initialData
              ? "New Password (leave empty to keep current)"
              : "Password"}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={
                initialData ? "Enter new password (optional)" : "Enter password"
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-[#00aeef] text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 transition"
          >
            {initialData ? "Update Admin" : "Create Admin & Proceed"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-muted text-muted-foreground py-2 rounded-md font-medium hover:opacity-90 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Permissions management component
function PermissionsManager({ adminData, onSave, onBack, isEditing }) {
  const [permissions, setPermissions] = useState({});
  const [expandedModules, setExpandedModules] = useState(
    new Set(["2", "2.2", "4.5"])
  );

  // Initialize permissions
  const initializePermissions = (modules) => {
    const perms = {};
    const traverse = (items) => {
      items.forEach((item) => {
        perms[item.id] = {
          authorized: false,
          actions: ACTIONS.reduce((acc, action) => {
            acc[action] = false;
            return acc;
          }, {}),
        };
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      });
    };
    traverse(modules);
    setPermissions(perms);
  };
  console.log("pERM", permissions);

  useEffect(() => {
    if (!isEditing) {
      initializePermissions(MODULES);
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && adminData?.permissions) {
      setPermissions(adminData.permissions);
    }
  }, [isEditing, adminData]);

  const toggleModuleExpand = (id) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(String(id))) {
      newExpanded.delete(String(id));
    } else {
      newExpanded.add(String(id));
    }
    setExpandedModules(newExpanded);
  };

  const toggleAuthorization = (id) => {
    const newPermissions = { ...permissions };
    const isCurrentlyAuthorized = permissions[id]?.authorized || false;

    // If this is a category module, toggle all its children
    if ([2, 3, 4, 5].includes(id)) {
      const toggleCategoryModules = (modules, shouldAuthorize) => {
        modules.forEach((module) => {
          if (module.id === id) {
            // Toggle all children of this category
            module.children.forEach((child) => {
              newPermissions[child.id] = {
                ...newPermissions[child.id],
                authorized: shouldAuthorize,
                actions: shouldAuthorize
                  ? newPermissions[child.id].actions
                  : ACTIONS.reduce((acc, action) => {
                      acc[action] = false;
                      return acc;
                    }, {}),
              };
              if (child.children) {
                child.children.forEach((nestedChild) => {
                  newPermissions[nestedChild.id] = {
                    ...newPermissions[nestedChild.id],
                    authorized: shouldAuthorize,
                    actions: shouldAuthorize
                      ? newPermissions[nestedChild.id].actions
                      : ACTIONS.reduce((acc, action) => {
                          acc[action] = false;
                          return acc;
                        }, {}),
                  };
                });
              }
            });
          }
        });
      };
      toggleCategoryModules(MODULES[0].children, !isCurrentlyAuthorized);
    } else {
      newPermissions[id] = {
        ...newPermissions[id],
        authorized: !isCurrentlyAuthorized,
        actions: !isCurrentlyAuthorized
          ? newPermissions[id].actions
          : ACTIONS.reduce((acc, action) => {
              acc[action] = false;
              return acc;
            }, {}),
      };
    }

    setPermissions(newPermissions);
  };

  const toggleSelectAllActions = (id) => {
    const allActionsSelected = ACTIONS.every(
      (action) => permissions[id]?.actions[action]
    );

    setPermissions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        actions: ACTIONS.reduce((acc, action) => {
          acc[action] = !allActionsSelected;
          return acc;
        }, {}),
      },
    }));
  };

  const toggleAction = (id, action) => {
    setPermissions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        actions: {
          ...prev[id].actions,
          [action]: !prev[id].actions[action],
        },
      },
    }));
  };

  const handleSave = () => {
    onSave({
      ...adminData,
      permissions,
    });
  };

  const toggleCategoryAll = (categoryId) => {
    const newPermissions = { ...permissions };
    const category = MODULES[0].children.find((c) => c.id === categoryId);

    if (!category) return;

    // Check if all modules in this category are already fully enabled
    const allModulesEnabled = category.children.every((module) => {
      const isAuthorized = permissions[module.id]?.authorized;
      const allActionsEnabled = ACTIONS.every(
        (action) => permissions[module.id]?.actions[action]
      );
      return isAuthorized && allActionsEnabled;
    });

    // Toggle all modules and their actions in this category
    const toggleCategoryModules = (modules, shouldEnable) => {
      modules.forEach((module) => {
        newPermissions[module.id] = {
          authorized: shouldEnable,
          actions: shouldEnable
            ? ACTIONS.reduce((acc, action) => {
                acc[action] = true;
                return acc;
              }, {})
            : ACTIONS.reduce((acc, action) => {
                acc[action] = false;
                return acc;
              }, {}),
        };
        if (module.children && module.children.length > 0) {
          toggleCategoryModules(module.children, shouldEnable);
        }
      });
    };

    toggleCategoryModules(category.children, !allModulesEnabled);
    setPermissions(newPermissions);
  };

  const toggleAllCategories = () => {
    const newPermissions = { ...permissions };

    // Check if all modules across all categories are fully enabled
    const allModulesEnabled = Object.keys(newPermissions).every((id) => {
      return (
        newPermissions[id]?.authorized &&
        ACTIONS.every((action) => newPermissions[id]?.actions[action])
      );
    });

    // Toggle all modules and actions everywhere
    const toggleAllModules = (modules, shouldEnable) => {
      modules.forEach((module) => {
        newPermissions[module.id] = {
          authorized: shouldEnable,
          actions: shouldEnable
            ? ACTIONS.reduce((acc, action) => {
                acc[action] = true;
                return acc;
              }, {})
            : ACTIONS.reduce((acc, action) => {
                acc[action] = false;
                return acc;
              }, {}),
        };
        if (module.children && module.children.length > 0) {
          toggleAllModules(module.children, shouldEnable);
        }
      });
    };

    toggleAllModules(MODULES, !allModulesEnabled);
    setPermissions(newPermissions);
  };

  const renderModuleTree = (modules) => {
    const categoriesToRender = modules[0].children;

    return [
      <div
        key="top-all"
        className={`grid border-b-2 border-border bg-accent/80 font-bold text-foreground`}
        style={{
          gridTemplateColumns: "60px 1fr 120px 1fr",
          alignItems: "center",
        }}
      >
        <div className="py-4 px-4"></div>
        <div className="py-4 px-4 text-sm uppercase tracking-wide">
          ALL CATEGORIES
        </div>
        <div className="py-4 px-4 flex justify-center">
          <button
            onClick={toggleAllCategories}
            className={`px-4 py-1 text-xs font-bold rounded border transition ${
              Object?.keys(permissions)?.every(
                (id) =>
                  permissions[id]?.authorized &&
                  ACTIONS.every((action) => permissions[id]?.actions[action])
              )
                ? "bg-primary text-primary-foreground border-primary"
                : "border-input bg-background text-foreground hover:border-primary"
            }`}
          >
            Select All
          </button>
        </div>
        <div className="py-4 px-4"></div>
      </div>,

      ...categoriesToRender.flatMap((category) => [
        // Category Header Row with All button
        <div
          key={`header-${category.id}`}
          className={`grid border-b border-border bg-muted/80 font-bold text-foreground`}
          style={{
            gridTemplateColumns: "60px 1fr 120px 1fr",
            alignItems: "center",
          }}
        >
          <div className="py-3 px-4"></div>
          <div className="py-3 px-4 text-sm uppercase tracking-wide">
            {category.name}
          </div>
          <div className="py-3 px-4 flex justify-center">
            <button
              onClick={() => toggleCategoryAll(category.id)}
              className={`px-3 py-1 text-xs font-medium rounded border transition ${
                category.children.every((mod) => {
                  const isAuthorized = permissions[mod.id]?.authorized;
                  const allActionsEnabled = ACTIONS.every(
                    (action) => permissions[mod.id]?.actions[action]
                  );
                  return isAuthorized && allActionsEnabled;
                })
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input bg-background text-foreground hover:border-primary"
              }`}
            >
              All
            </button>
          </div>
          <div className="py-3 px-4"></div>
        </div>,

        // Category Modules
        ...category.children.flatMap((module) => renderModuleRow(module)),
      ]),
    ];
  };

  const renderModuleRow = (module) => {
    return (
      <div key={module.id}>
        <div
          className={`grid border-b border-border hover:bg-muted/30`}
          style={{
            gridTemplateColumns: "60px 1fr 120px 1fr",
            alignItems: "center",
          }}
        >
          {/* Sr.No. Column */}
          <div className="py-3 px-4 flex items-center gap-2">
            {module.children && module.children.length > 0 && (
              <button
                onClick={() => toggleModuleExpand(module.id)}
                className="p-1 hover:bg-input rounded"
              >
                <ChevronDown
                  size={16}
                  className={`transition ${
                    expandedModules.has(String(module.id)) ? "" : "-rotate-90"
                  }`}
                />
              </button>
            )}
            <span className="text-sm font-medium">{module.id}</span>
          </div>

          {/* Module Name Column */}
          <div
            className={`py-3 px-4 ${module.level === 1 ? "font-semibold" : ""}`}
          >
            {module.name}
          </div>

          {/* Authorization Column */}
          <div className="py-3 px-4 flex justify-center">
            <input
              type="checkbox"
              checked={permissions[module.id]?.authorized || false}
              onChange={() => toggleAuthorization(module.id)}
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          <div className="py-3 px-4">
            {permissions[module.id]?.authorized && (
              <div className="flex gap-2 items-center flex-wrap">
                {/* Individual Permission Checkboxes */}
                {ACTIONS.map((action) => (
                  <label
                    key={action}
                    className="flex items-center gap-1 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={permissions[module.id].actions[action] || false}
                      onChange={() => toggleAction(module.id, action)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="capitalize text-foreground">{action}</span>
                  </label>
                ))}

                {/* Select All Button for Row */}
                <button
                  onClick={() => toggleSelectAllActions(module.id)}
                  className={`ml-auto px-2 py-1 text-xs font-medium rounded border transition ${
                    ACTIONS.every(
                      (action) => permissions[module.id].actions[action]
                    )
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-input bg-background text-foreground hover:border-primary"
                  }`}
                >
                  All
                </button>
              </div>
            )}
          </div>
        </div>

        {expandedModules.has(String(module.id)) &&
          module.children &&
          module.children.length > 0 &&
          module.children.map((child) => renderModuleRow(child))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      <div className="bg-accent/50 p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          System Rights Management
        </h2>
        <p className="text-muted-foreground">
          Setting permissions for:{" "}
          <span className="font-semibold">{adminData.name}</span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table Header */}
          <div
            className="grid border-b border-border bg-muted font-semibold"
            style={{
              gridTemplateColumns: "60px 1fr 120px 1fr",
              alignItems: "center",
            }}
          >
            <div className="py-3 px-4 text-sm text-foreground">Sr.No.</div>
            <div className="py-3 px-4 text-sm text-foreground">Module Name</div>
            <div className="py-3 px-4 text-sm text-foreground text-center">
              Authorization
            </div>
            <div className="py-3 px-4 text-sm text-foreground">
              System Actions
            </div>
          </div>

          {/* Table Body */}
          <div>{renderModuleTree(MODULES)}</div>
        </div>
      </div>

      <div className="flex gap-3 p-6 border-t border-border bg-muted/30">
        <button
          onClick={handleSave}
          className="flex-1 bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 transition"
        >
          Save Permissions
        </button>
        <button
          onClick={onBack}
          className="flex-1 bg-muted text-muted-foreground py-2 rounded-md font-medium hover:opacity-90 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}

// Main admin management page
export default function AdminManagementPage() {
  const [currentStep, setCurrentStep] = useState("list"); // 'list', 'form', 'permissions', 'edit-permissions'
  const { admins, getAllAdmins, createAdmin, updateAdmin, deleteAdmin } =
    useAdminStore();
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [adminStates, setAdminStates] = useState({
    page: 1,
    limit: 20,
    totalPages: 0,
    totalAdmins: 0,
    loading: false,
    searchTerm: "",
    activeFilter: "",
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await getAllAdmins({
          page: adminStates.page,
          limit: adminStates.limit,
          search: adminStates.searchTerm,
          active: adminStates.activeFilter,
        });

        setAdminStates((prev) => ({
          ...prev,
          totalPages: res.totalPages,
          totalAdmins: res.total,
          loading: false,
        }));
      } catch (error) {
        console.error("Error fetching admins:", error);
        setAdminStates((prev) => ({ ...prev, loading: false }));
      }
    };

    // ONLY set loading ONCE
    setAdminStates((prev) => ({ ...prev, loading: true }));
    fetchAdmins();
  }, [
    adminStates.page,
    adminStates.limit,
    adminStates.searchTerm,
    adminStates.activeFilter,
  ]);

  // const handleAddAdmin = (formData) => {
  //   setCurrentAdmin(formData);
  //   setCurrentStep("permissions");
  // };

  const [submitting, setSubmitting] = useState(false);

  const handleSavePermissions = async (completeAdmin) => {
    setSubmitting(true);
    if (editingId !== null) {
      await updateAdmin(editingId, completeAdmin);
      setEditingId(null);
    } else {
      await createAdmin(completeAdmin);
    }
    setCurrentStep("list");
    setCurrentAdmin(null);
  };

  const handleEditAdmin = (admin) => {
    setEditingId(admin._id);
    setCurrentAdmin({
      name: admin.name || "",
      email: admin.email || "",
      permissions: admin.permissions || {},
    });

    setCurrentStep("form");
  };

  const handleDeleteClick = (admin) => {
    setDeletingId(admin._id);
    setShowDeleteModel(true);
  };

  const handleDeleteAdmin = async () => {
    if (!deletingId) return;
    setSubmitting(true);
    await deleteAdmin(deletingId);
    setSubmitting(false);

    setDeletingId(null);
    setShowDeleteModel(false);
  };

  const handleFormSubmit = (formData) => {
    console.log("Inside", formData);
    setCurrentAdmin({ ...formData });
    if (editingId !== null) {
      setCurrentStep("edit-permissions");
    } else {
      setCurrentStep("permissions");
    }
  };
  console.log(currentAdmin);

  const handleBack = () => {
    setCurrentStep("list");
    setCurrentAdmin(null);
    setEditingId(null);
  };

  if (currentStep === "form") {
    return (
      <div className="min-h-screen ">
        <div className="">
          <AdminForm
            onSubmit={handleFormSubmit}
            onCancel={handleBack}
            initialData={editingId !== null ? currentAdmin : null}
          />
        </div>
      </div>
    );
  }

  if (currentStep === "permissions") {
    return (
      <div className="min-h-screen ">
        <div className="">
          <PermissionsManager
            isEditing={false}
            adminData={currentAdmin}
            onSave={handleSavePermissions}
            onBack={() => setCurrentStep("form")}
          />
        </div>
      </div>
    );
  }

  if (currentStep === "edit-permissions") {
    return (
      <div className="min-h-screen ">
        <div className="">
          <PermissionsManager
            isEditing={true}
            adminData={currentAdmin}
            onSave={handleSavePermissions}
            onBack={() => setCurrentStep("form")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Admin Management
          </h1>
          <button
            onClick={() => {
              setEditingId(null);
              setCurrentStep("form");
            }}
            className="bg-[#00aeef] text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 transition"
          >
            + Add New Admin
          </button>
        </div>

        {admins.length === 0 ? (
          <div className="bg-white rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground text-lg">
              No admins added yet. Click "Add New Admin" to get started.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Modules Access
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, idx) => {
                  const accessCount = Object.values(admin.permissions).filter(
                    (p) => p.authorized
                  ).length;
                  return (
                    <tr
                      key={idx}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-4 text-foreground">
                        {admin.name}
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {admin.email}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {accessCount} modules
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() => handleEditAdmin(admin)}
                          className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded hover:opacity-90"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(admin)}
                          className="px-3 py-1 bg-destructive text-white text-sm rounded hover:opacity-90"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Delete Item Modal */}
      {showDeleteModel && deletingId && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full max-h-[50vh] overflow-y-auto p-3">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Delete Item</h2>
              <button
                onClick={() => {
                  setShowDeleteModel(false);
                  setDeletingId(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              {/* Confirmation Text */}
              <p className="text-gray-700 text-center">
                Are you sure you want to delete this admin ? This action cannot
                be undone.
              </p>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleDeleteAdmin}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>

                <button
                  onClick={() => {
                    setShowDeleteModel(false);
                    setDeletingId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
