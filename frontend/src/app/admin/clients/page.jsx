"use client";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  Mail,
  FileText,
  Building2,
  AlertCircle,
} from "lucide-react";
import useAdminStore from "@/stores/useAdminStore";
import toast from "react-hot-toast"
import { useRouter } from "next/navigation";

const ClientsPage = () => {
  // const [clients, setClients] = useState([
  //   {
  //     id: 1,
  //     client_name: "John Doe",
  //     official_phone: "+91 9876543210",
  //     alternate_phone: "+91 9123456789",
  //     official_email: "john.doe@company.com",
  //     alternate_email: "johndoe.personal@gmail.com",
  //     website: "https://www.company.com",
  //     gst_number: "27AAEPM1234C1ZV",
  //     company: {
  //       company_name: "ABC Technologies Pvt Ltd",
  //       company_address: "123, MG Road, Koramangala",
  //       pin_code: "560095",
  //       city: "Bengaluru",
  //       state: "Karnataka",
  //       country: "India",
  //     },
  //   },
  // ])
  
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCity, setFilterCity] = useState("");
  const [filterState, setFilterState] = useState("");
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);
  const [showViewSidebar, setShowViewSidebar] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const router = useRouter();

  const { clients, getAllClients, createClient, updateClient, deleteClient } =
    useAdminStore();

  const [formData, setFormData] = useState({
    client_name: "",
    official_phone: "",
    alternate_phone: "",
    official_email: "",
    alternate_email: "",
    website: "",
    gst_number: "",
    company: {
      company_name: "",
      company_address: "",
      pin_code: "",
      city: "",
      state: "",
      country: "",
    },
  });

  // const uniqueCities = [...new Set(clients.map((c) => c.company.city))].filter(
  //   Boolean
  // );
  // const uniqueStates = [...new Set(clients.map((c) => c.company.state))].filter(
  //   Boolean
  // );

  // const filteredClients = useMemo(() => {
  //   return clients.filter((client) => {
  //     const matchesSearch =
  //       client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       client.company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       client.official_email.toLowerCase().includes(searchTerm.toLowerCase())

  //     const matchesCity = filterCity === "" || client.company.city === filterCity
  //     const matchesState = filterState === "" || client.company.state === filterState

  //     return matchesSearch && matchesCity && matchesState
  //   })
  // }, [clients, searchTerm, filterCity, filterState])

  const handleAddClick = () => {
    setFormData({
      client_name: "",
      official_phone: "",
      alternate_phone: "",
      official_email: "",
      alternate_email: "",
      website: "",
      gst_number: "",
      company: {
        company_name: "",
        company_address: "",
        pin_code: "",
        city: "",
        state: "",
        country: "",
      },
    });
    setShowAddSidebar(true);
  };
  const resetForm = () => {
    setFormData({
      client_name: "",
      official_phone: "",
      alternate_phone: "",
      official_email: "",
      alternate_email: "",
      website: "",
      gst_number: "",
      company: {
        company_name: "",
        company_address: "",
        pin_code: "",
        city: "",
        state: "",
        country: "",
      },
    });
  };

  const handleEditClick = (client) => {
    setSelectedClient(client);
    setEditLoading(true);

    setFormData({
      client_name: client?.client_name || "",
      official_phone: client?.official_phone || "",
      alternate_phone: client?.alternate_phone || "",
      official_email: client?.official_email || "",
      alternate_email: client?.alternate_email || "",
      website: client?.website || "",
      gst_number: client?.gst_number || "",
      company: {
        company_name: client?.company?.company_name || "",
        company_address: client?.company?.company_address || "",
        pin_code: client?.company?.pin_code || "",
        city: client?.company?.city || "",
        state: client?.company?.state || "",
        country: client?.company?.country || "",
      },
    });

    setTimeout(() => setEditLoading(false), 300);
    setShowEditSidebar(true);
  };

  const handleViewClick = (client) => {
    setSelectedClient(client);
    setShowViewSidebar(true);
  };

  const handleAddSave = async () => {
    if (!formData.client_name && !formData.email) {
      toast.error("client_name and email are required");
      return;
    }
    try {
      setAddLoading(true);
      await createClient(formData);
      setShowAddSidebar(false);
      resetForm();
    } catch (error) {
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!formData.client_name && !formData.email) {
      toast.error("client_name and email are required");
      return;
    }
    try {
      setAddLoading(true);
      await updateClient(selectedClient._id, formData);
      setShowEditSidebar(false);
      resetForm();
    } catch (error) {
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = (client) => {
    setDeleteTarget(client);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    try {
      deleteClient(deleteTarget._id);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    } catch (error) {}
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterCity("");
    setFilterState("");
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setFetching(true);
        const { clients, total, currentPage, totalPages } = await getAllClients(
          {
            page,
            limit,
            search: searchTerm,
          }
        );
        setPage(currentPage);
        setTotal(total);
        setTotalPages(totalPages);
      } catch (error) {
      } finally {
        setFetching(false);
      }
    };
    fetchClients();
  }, [page, limit, searchTerm]);

useEffect(() => {
  // Only run on client side
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    const convert = searchParams.get("convert");
    if (convert === "true") {
      const name = searchParams.get("name") || "";
      const email = searchParams.get("email") || "";
      const company_name = searchParams.get("company_name") || "";

      // Prefill the form
      setFormData({
        client_name: name,
        official_email: email,
        official_phone: "",
        alternate_phone: "",
        alternate_email: "",
        website: "",
        gst_number: "",
        company: {
          company_name,
          company_address: "",
          pin_code: "",
          city: "",
          state: "",
          country: "",
        },
      });

      // Open edit sidebar
      setShowAddSidebar(true)
    }
  }
}, []); // Remove searchParams from dependencies

useEffect(() => {
  // Only run on client side
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("convert") === "true") {
      router.replace("/admin/clients"); // removes ?convert=true from URL
    }
  }
}, [router]); // Add router to dependencies

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto p-2">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Clients</h1>
          <p className="text-black">
            Manage and organize your client information
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 items-center mb-6 p-4 rounded-lg bg-white border border-slate-300">
          <div className="flex-1 min-w-48">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2  border border-slate-300 rounded-lg text-black placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          {/* <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition cursor-pointer"
          >
            <option value="">All Cities</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition cursor-pointer"
          >
            <option value="">All States</option>
            {uniqueStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select> */}

          <button
            onClick={handleClearFilters}
            className="px-4 py-2  hover:bg-slate-300 border border-slate-300 rounded-lg text-black transition"
          >
            Clear
          </button>

          <button
            onClick={handleAddClick}
            className="ml-auto px-4 py-2 bg-[#00aeef] hover:to-blue-600 text-white rounded-lg font-medium flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </button>
        </div>

        {/* Clients Table */}
        <div className="bg-white border border-slate-300 rounded-lg overflow-hidden">
          {clients.length === 0 ? (
            <div className="p-8 text-center">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No clients found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-300 ">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Client Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr
                      key={client._id}
                      className="border-b border-slate-400  transition"
                    >
                      <td className="px-6 py-4 text-black font-medium">
                        {client.client_name}
                      </td>
                      <td className="px-6 py-4 text-black">
                        {client.company.company_name}
                      </td>
                      <td className="px-6 py-4 text-black text-sm">
                        {client.official_email}
                      </td>
                      <td className="px-6 py-4 text-black">
                        {client.company.city}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewClick(client)}
                            className="p-2 hover:bg-slate-200 rounded transition text-cyan-400"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditClick(client)}
                            className="p-2 hover:bg-slate-200 rounded transition text-blue-400"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(client)}
                            className="p-2 hover:bg-slate-200 rounded transition text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Client Sidebar */}
      {showAddSidebar && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAddSidebar(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white border-l border-slate-300 shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">Add Client</h2>
                <button
                  onClick={() => setShowAddSidebar(false)}
                  className="p-2 hover:bg-slate-800 text-slate-700 hover:text-white rounded transition"
                >
                  <X className="w-5 h-5 " />
                </button>
              </div>

              {addLoading ? (
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i}>
                      <div className="h-4 bg-slate-800 rounded w-24 mb-2" />
                      <div className="h-10 bg-slate-800 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={formData.client_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          client_name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black  focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter client name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company.company_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: {
                            ...formData.company,
                            company_name: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      value={formData.official_email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          official_email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Official Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.official_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          official_phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter phone"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Alternate Email
                    </label>
                    <input
                      type="email"
                      value={formData.alternate_email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          alternate_email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter alternate email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Alternate Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.alternate_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          alternate_phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter alternate phone"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={formData.gst_number}
                      onChange={(e) =>
                        setFormData({ ...formData, gst_number: e.target.value })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter GST number"
                    />
                  </div>

                  <div className="border-t border-slate-300 pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-black mb-4">
                      Company Address
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.company.company_address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            company: {
                              ...formData.company,
                              company_address: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2  border border-slate-300 rounded-lg text-blaclk focus:outline-none focus:border-cyan-500 transition"
                        placeholder="Enter address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.company.city}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: {
                                ...formData.company,
                                city: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={formData.company.state}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: {
                                ...formData.company,
                                state: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                          placeholder="State"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          value={formData.company.pin_code}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: {
                                ...formData.company,
                                pin_code: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                          placeholder="PIN Code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.company.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: {
                                ...formData.company,
                                country: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => setShowAddSidebar(false)}
                      className="flex-1 px-4 py-2 bg-[#e71010a7] hover:bg-slate-700 text-white rounded-lg font-medium transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSave}
                      className="flex-1 px-4 py-2 bg-[#00aeef] hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition"
                    >
                      Save Client
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Sidebar */}
      {showEditSidebar && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowEditSidebar(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white border-l border-slate-300 shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">Edit Client</h2>
                <button
                  onClick={() => setShowEditSidebar(false)}
                  className="p-2 hover:bg-[red] text-slate-700 hover:text-white  rounded transition"
                >
                  <X className="w-5 h-5 " />
                </button>
              </div>

              {editLoading ? (
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i}>
                      <div className="h-4 bg-slate-300 rounded w-24 mb-2" />
                      <div className="h-10 bg-slate-300 rounded animate-pulse" />
                    </div>
                    
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={formData.client_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          client_name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter client name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company.company_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: {
                            ...formData.company,
                            company_name: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      value={formData.official_email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          official_email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Official Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.official_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          official_phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter phone"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Alternate Email
                    </label>
                    <input
                      type="email"
                      value={formData.alternate_email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          alternate_email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter alternate email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Alternate Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.alternate_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          alternate_phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter alternate phone"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={formData.gst_number}
                      onChange={(e) =>
                        setFormData({ ...formData, gst_number: e.target.value })
                      }
                      className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter GST number"
                    />
                  </div>

                  <div className="border-t border-slate-300 pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-black mb-4">
                      Company Address
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.company.company_address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            company: {
                              ...formData.company,
                              company_address: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                        placeholder="Enter address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.company.city}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: {
                                ...formData.company,
                                city: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={formData.company.state}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: {
                                ...formData.company,
                                state: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                          placeholder="State"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          value={formData.company.pin_code}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: {
                                ...formData.company,
                                pin_code: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2  border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                          placeholder="PIN Code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.company.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: {
                                ...formData.company,
                                country: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-black focus:outline-none focus:border-cyan-500 transition"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-slate-300">
                    <button
                      onClick={() => setShowEditSidebar(false)}
                      className="flex-1 px-4 py-2 bg-[#ff0000de] hover:bg-slate-100 text-white rounded-lg font-medium transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditSave}
                      className="flex-1 px-4 py-2 bg-[#00aeef] hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Client Sidebar */}
      {showViewSidebar && selectedClient && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowViewSidebar(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white border-l border-slate-300 shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">
                  Client Details
                </h2>
                <button
                  onClick={() => setShowViewSidebar(false)}
                  className="p-2 hover:bg-slate-800 rounded transition"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    Personal Information
                  </h3>
                  <div className="space-y-3 border p-4 rounded-lg">
                    <div>
                      <p className="text-xs font-semibold text-slate-700 uppercase">
                        Client Name
                      </p>
                      <p className="text-black">{selectedClient.client_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 uppercase">
                        GST Number
                      </p>
                      <p className="text-black">{selectedClient.gst_number}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    Contact Information
                  </h3>
                  <div className="space-y-3 border p-4 rounded-lg">
                    <div>
                      <p className="text-xs font-semibold text-slate-700 uppercase">
                        Official Email
                      </p>
                      <p className="text-black break-all">
                        {selectedClient.official_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 uppercase">
                        Official Phone
                      </p>
                      <p className="text-black">
                        {selectedClient.official_phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 uppercase">
                        Alternate Email
                      </p>
                      <p className="text-black break-all">
                        {selectedClient.alternate_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 uppercase">
                        Alternate Phone
                      </p>
                      <p className="text-black">
                        {selectedClient.alternate_phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 uppercase">
                        Website
                      </p>
                      <a
                        href={selectedClient.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-800 hover:text-cyan-300 break-all"
                      >
                        {selectedClient.website}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-green-400" />
                    Company Information
                  </h3>
                  <div className="space-y-3 border p-4 rounded-lg">
                    <div>
                      <p className="text-xs font-semibold text-slate-700 uppercase">
                        Company Name
                      </p>
                      <p className="text-black">
                        {selectedClient.company.company_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 uppercase">
                        Address
                      </p>
                      <p className="text-black">
                        {selectedClient.company.company_address}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-700 uppercase">
                          City
                        </p>
                        <p className="text-black">
                          {selectedClient.company.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700 uppercase">
                          State
                        </p>
                        <p className="text-black">
                          {selectedClient.company.state}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-700 uppercase">
                          PIN Code
                        </p>
                        <p className="text-black">
                          {selectedClient.company.pin_code}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700 uppercase">
                          Country
                        </p>
                        <p className="text-black">
                          {selectedClient.company.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => {
                      setShowViewSidebar(false);
                      handleEditClick(selectedClient);
                    }}
                    className="flex-1 px-4 py-2 bg-[#00aeef] hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Client
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white border border-slate-300 rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-bold text-black">Delete Client</h3>
            </div>
            <p className="text-slate-700 mb-6">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.client_name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
