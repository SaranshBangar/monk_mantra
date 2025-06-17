"use client";

import { useState } from "react";
import { Trash2, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/app/actions";

interface TaskItemProps {
  task: Task;
  onToggleStatus: (task: Task) => Promise<void>;
  onDelete: (taskId: string) => void;
  formatDate: (dateString: string) => string;
}

const TaskItem = ({ task, onToggleStatus, onDelete, formatDate }: TaskItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleStatus = async () => {
    try {
      await onToggleStatus(task);
    } catch (error) {
      console.error("Failed to toggle task status:", error);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      onDelete(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setIsDeleting(false);
    }
  };

  const isComplete = task.status === "complete";

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md group ${
        isComplete ? "border-green-200 bg-green-50/30" : "border-gray-200"
      }`}
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-0.5">
            <label className="inline-flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={isComplete}
                onChange={handleToggleStatus}
                className="sr-only"
                aria-describedby={`task-${task.id}-description`}
              />
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  isComplete ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-green-400 group-hover:border-green-400"
                }`}
              >
                {isComplete && <CheckCircle2 className="w-3 h-3" />}
              </div>
            </label>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3
                className={`font-semibold text-base leading-tight transition-all duration-200 ${
                  isComplete ? "text-gray-500 line-through" : "text-gray-900 group-hover:text-gray-700"
                }`}
                id={`task-${task.id}-description`}
              >
                {task.title}
              </h3>

              <Badge variant={isComplete ? "success" : "warning"} className="flex-shrink-0">
                {isComplete ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Complete
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" /> Pending
                  </>
                )}
              </Badge>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1.5" />
              <span>Created {formatDate(task.createdAt)}</span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
              aria-label={`Delete task: ${task.title}`}
            >
              <Trash2 className={`h-4 w-4 ${isDeleting ? "animate-pulse" : ""}`} />
            </Button>
          </div>
        </div>

        <div className={`mt-3 h-1 bg-gray-100 rounded-full overflow-hidden transition-all duration-300 ${isComplete ? "opacity-100" : "opacity-0"}`}>
          <div className="h-full bg-green-500 w-full transform origin-left transition-transform duration-500" />
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
