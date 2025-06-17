"use client";

import { useState, useEffect } from "react";
import { Plus, Search, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getAllTasks, addTask, updateTask, updateTaskStatus, deleteTask, Task, TaskStatus } from "../app/actions";
import TaskItem from "./TaskItem";

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("pending");
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskStatus, setEditTaskStatus] = useState<TaskStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await getAllTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      await addTask(newTaskTitle, newTaskStatus);
      setNewTaskTitle("");
      setNewTaskStatus("pending");
      setIsAddDialogOpen(false);
      loadTasks();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleEditTask = async () => {
    if (!editingTask || !editTaskTitle.trim()) return;

    try {
      await updateTask(editingTask.id, editTaskTitle, editTaskStatus);
      setEditingTask(null);
      setEditTaskTitle("");
      setEditTaskStatus("pending");
      setIsEditDialogOpen(false);
      loadTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setIsDeleteDialogOpen(false);
      setDeleteTaskId(null);
      loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const openDeleteDialog = (taskId: string) => {
    setDeleteTaskId(taskId);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus: TaskStatus = task.status === "pending" ? "complete" : "pending";
    try {
      await updateTaskStatus(task.id, newStatus);
      loadTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskStatus(task.status);
    setIsEditDialogOpen(true);
  };

  const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-800 font-medium text-lg animate-spin">
          <LoaderCircle />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Task Manager</h1>

          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 text-gray-900"
              />
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gray-800 hover:bg-gray-900 text-white shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Add New Task</DialogTitle>
                  <DialogDescription className="text-gray-700">Create a new task with a title and status.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="task-title" className="text-sm font-medium text-gray-800">
                      Task Title
                    </label>
                    <Input
                      id="task-title"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Enter task title..."
                      className="text-gray-900"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="task-status" className="text-sm font-medium text-gray-800">
                      Status
                    </label>
                    <select
                      id="task-status"
                      value={newTaskStatus}
                      onChange={(e) => setNewTaskStatus(e.target.value as TaskStatus)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="complete">Complete</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    Cancel
                  </Button>
                  <Button onClick={handleAddTask} className="bg-gray-800 hover:bg-gray-900 text-white">
                    Add Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-700 text-lg mb-2 font-medium">No tasks found</div>
              <div className="text-gray-600 text-sm">{searchTerm ? "Try adjusting your search terms" : "Create your first task to get started"}</div>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggleStatus={handleToggleStatus} onDelete={openDeleteDialog} formatDate={formatDate} />
            ))
          )}
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Edit Task</DialogTitle>
              <DialogDescription className="text-gray-700">Update the task title and status.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-task-title" className="text-sm font-medium text-gray-800">
                  Task Title
                </label>
                <Input
                  id="edit-task-title"
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                  placeholder="Enter task title..."
                  className="text-gray-900"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-task-status" className="text-sm font-medium text-gray-800">
                  Status
                </label>
                <select
                  id="edit-task-status"
                  value={editTaskStatus}
                  onChange={(e) => setEditTaskStatus(e.target.value as TaskStatus)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                Cancel
              </Button>
              <Button onClick={handleEditTask} className="bg-gray-800 hover:bg-gray-900 text-white cursor-pointer">
                Update Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Delete Task</DialogTitle>
              <DialogDescription className="text-gray-700">
                Are you sure you want to delete this task? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                Cancel
              </Button>
              <Button onClick={() => deleteTaskId && handleDeleteTask(deleteTaskId)} className="bg-red-600 hover:bg-red-700 text-white">
                Delete Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TaskManager;
