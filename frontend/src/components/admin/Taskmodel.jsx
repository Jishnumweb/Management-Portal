"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AddTaskModal({ employees, onAddTask }) {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState(employees[0] || "");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = () => {
    if (!title || !assignedTo || !dueDate) return;
    onAddTask({ id: Date.now(), title, assignedTo, dueDate, status: "Pending" });
    setTitle(""); setAssignedTo(employees[0] || ""); setDueDate("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#00aeef] text-white hover:bg-blue-700">Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div>
            <Label>Task Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title" />
          </div>
          <div>
            <Label>Assign to</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Due Date</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-green-600 text-white hover:bg-green-700">Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
