"use client";

import { useState } from "react";
import TaskHeaderMain from "./TaskHeaderMain";
import TaskFilters from "./TaskFilters";
import TaskInstructions from "./TaskInstructions";

export interface TaskFilters {
  priority?: "low" | "medium" | "high" | null;
  status?: "todo" | "in-progress" | "done" | null;
}

interface TaskBoardHeaderProps {
  onCreateTask: () => void;
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

export default function TaskBoardHeader({
  onCreateTask,
  filters,
  onFiltersChange,
}: TaskBoardHeaderProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  return (
    <div className="mb-6">
      <TaskHeaderMain onCreateTask={onCreateTask} onToggleInstructions={toggleInstructions} />
      <TaskFilters filters={filters} onFiltersChange={onFiltersChange} />
      <TaskInstructions isVisible={showInstructions} onClose={handleCloseInstructions} />
    </div>
  );
}

