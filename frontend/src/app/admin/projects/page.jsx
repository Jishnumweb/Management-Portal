"use client"

import { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Eye, Download, Search, XCircle } from "lucide-react"

const employees = ["Rahul", "Neha", "Vishnu", "Jishnu", "Priya", "Arjun"]
const projectStatuses = ["Planned", "In Progress", "Completed", "On Hold"]

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Website Redesign",
      description: "Redesign the company website with modern UI.",
      manager: "Rahul",
      team: ["Neha", "Vishnu"],
      startDate: "2025-10-01",
      endDate: "2025-12-15",
      status: "In Progress",
      tasks: [
        { title: "UI Mockups", assignedTo: "Neha", completed: true },
        { title: "Frontend Development", assignedTo: "Vishnu", completed: false },
      ],
    },
    {
      id: 2,
      title: "Mobile App Launch",
      description: "Develop and launch the mobile app for Android and iOS.",
      manager: "Jishnu",
      team: ["Priya", "Arjun"],
      startDate: "2025-09-20",
      endDate: "2025-11-30",
      status: "Planned",
      tasks: [],
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [manager, setManager] = useState("")
  const [team, setTeam] = useState([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [status, setStatus] = useState("Planned")
  const [tasks, setTasks] = useState([]) // For tasks input

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project)
      setTitle(project.title)
      setDescription(project.description)
      setManager(project.manager)
      setTeam(project.team)
      setStartDate(project.startDate)
      setEndDate(project.endDate)
      setStatus(project.status)
      setTasks(project.tasks)
    } else resetForm()
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setEditingProject(null)
    setTitle("")
    setDescription("")
    setManager("")
    setTeam([])
    setStartDate("")
    setEndDate("")
    setStatus("Planned")
    setTasks([])
  }

  const handleSaveProject = () => {
    if (!title || !manager || !startDate || !endDate) {
      alert("Please fill all required fields!")
      return
    }
    const newProject = { id: editingProject ? editingProject.id : Date.now(), title, description, manager, team, startDate, endDate, status, tasks }
    if (editingProject) {
      setProjects(projects.map(p => (p.id === editingProject.id ? newProject : p)))
    } else setProjects([newProject, ...projects])
    setIsModalOpen(false)
    resetForm()
  }

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter(p => p.id !== id))
    }
  }

  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus === "all" ? true : p.status === filterStatus)
    )
  }, [projects, search, filterStatus])

  const exportProjects = () => {
    const csv = [
      ["Title", "Manager", "Team", "Start Date", "End Date", "Status"].join(","),
      ...filteredProjects.map(p =>
        [p.title, p.manager, p.team.join(";"), p.startDate, p.endDate, p.status].join(",")
      )
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "projects.csv"
    a.click()
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Projects</h1>
          <p className="text-slate-500">Manage company projects efficiently</p>
        </div>
        <Button onClick={() => openModal()} className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 h-11 px-6">
          <Plus className="w-5 h-5" /> Add Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 flex-wrap mb-6">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border border-slate-300"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-48 border border-slate-300">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent className="border border-slate-300">
            <SelectItem value="all">All Status</SelectItem>
            {projectStatuses.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={exportProjects} variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-100">
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="border border-slate-300">
          <CardContent className="pt-12 pb-12 text-center">
            <XCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No projects found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p) => (
            <Card key={p.id} className="border border-slate-300 hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-900 text-lg mb-2 line-clamp-2">{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-slate-600">{p.description}</p>
                <p className="text-sm text-slate-600"><strong>Manager:</strong> {p.manager}</p>
                <p className="text-sm text-slate-600"><strong>Team:</strong> {p.team.join(", ")}</p>
                <p className="text-sm text-slate-600"><strong>Duration:</strong> {p.startDate} - {p.endDate}</p>
                <p className="text-sm text-slate-600">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.status === "Completed" ? "bg-green-100 text-green-700" :
                      p.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                      p.status === "Planned" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </p>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => { setSelectedProject(p); setIsDetailsOpen(true) }} className="flex-1 bg-gray-100 text-slate-900 hover:bg-gray-200">
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                  <Button size="sm" onClick={() => openModal(p)} variant="outline" className="flex-1 border border-slate-300 text-slate-600 hover:bg-gray-50">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={() => handleDelete(p.id)} className="flex-1 bg-red-100 text-red-700 hover:bg-red-200">
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editingProject ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input placeholder="Project Title *" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input placeholder="Manager *" value={manager} onChange={(e) => setManager(e.target.value)} />
            <Input placeholder="Team (comma separated)" value={team.join(", ")} onChange={(e) => setTeam(e.target.value.split(",").map(t => t.trim()))} />
            <Input type="date" placeholder="Start Date *" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" placeholder="End Date *" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {projectStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleSaveProject} className="bg-blue-500 hover:bg-blue-600 text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedProject?.title}</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-2 mt-4">
              <p><strong>Description:</strong> {selectedProject.description}</p>
              <p><strong>Manager:</strong> {selectedProject.manager}</p>
              <p><strong>Team:</strong> {selectedProject.team.join(", ")}</p>
              <p><strong>Duration:</strong> {selectedProject.startDate} - {selectedProject.endDate}</p>
              <p><strong>Status:</strong> {selectedProject.status}</p>
              <p><strong>Tasks:</strong></p>
              <ul className="list-disc pl-5">
                {selectedProject.tasks.length === 0 ? <li>No tasks</li> : selectedProject.tasks.map((t, i) => (
                  <li key={i}>{t.title} - {t.assignedTo} - {t.completed ? "✅" : "❌"}</li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
