import { Router } from "express";
import Task from "../models/Task";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all tasks for authenticated user
router.get("/", async (req, res) => {
  try {
    const { status, priority, assignee } = req.query;
    const filter: any = {};

    // Filter by status if provided
    if (status && typeof status === "string") {
      filter.status = status;
    }

    // Filter by priority if provided
    if (priority && typeof priority === "string") {
      filter.priority = priority;
    }

    // Filter by assignee if provided
    if (assignee && typeof assignee === "string") {
      filter.assignee = assignee;
    }

    const tasks = await Task.find(filter)
      .populate("assignee", "name email")
      .populate("creator", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
    });
  }
});

// Get single task by ID
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignee", "name email")
      .populate("creator", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      data: { task },
    });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching task",
    });
  }
});

// Create new task
router.post("/", async (req, res) => {
  try {
    const { title, description, status, priority, assignee, dueDate, tags } = req.body;
    const userId = (req as any).userId;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const task = new Task({
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      assignee: assignee || userId,
      creator: userId,
      dueDate,
      tags: tags || [],
    });

    await task.save();
    await task.populate("assignee", "name email");
    await task.populate("creator", "name email");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating task",
    });
  }
});

// Update task
router.put("/:id", async (req, res) => {
  try {
    const { title, description, status, priority, assignee, dueDate, tags } = req.body;
    const userId = (req as any).userId;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user is creator or assignee
    if (task.creator.toString() !== userId && task.assignee?.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assignee && { assignee }),
        ...(dueDate && { dueDate }),
        ...(tags && { tags }),
      },
      { new: true, runValidators: true },
    )
      .populate("assignee", "name email")
      .populate("creator", "name email");

    res.json({
      success: true,
      message: "Task updated successfully",
      data: {
        task: updatedTask,
        subtaskProgress: updatedTask?.getSubtaskProgress(),
      },
    });
  } catch (error: any) {
    console.error("Update task error:", error);

    // Si es un error de validación de subtareas
    if (error.message && error.message.includes("subtarea(s) pendiente(s)")) {
      return res.status(400).json({
        success: false,
        message: error.message,
        code: "INCOMPLETE_SUBTASKS",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating task",
    });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    const userId = (req as any).userId;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Only creator can delete the task
    if (task.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this task",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting task",
    });
  }
});

// Add subtask
router.post("/:id/subtasks", async (req, res) => {
  try {
    const { title } = req.body;
    const userId = (req as any).userId;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Subtask title is required",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user is creator or assignee
    if (task.creator.toString() !== userId && task.assignee?.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this task",
      });
    }

    task.subtasks.push({
      title,
      completed: false,
      createdAt: new Date(),
    });

    await task.save();
    await task.populate("assignee", "name email");
    await task.populate("creator", "name email");

    res.status(201).json({
      success: true,
      message: "Subtask added successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Add subtask error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding subtask",
    });
  }
});

// Update subtask
router.put("/:id/subtasks/:subtaskId", async (req, res) => {
  try {
    const { title, completed } = req.body;
    const userId = (req as any).userId;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user is creator or assignee
    if (task.creator.toString() !== userId && task.assignee?.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this task",
      });
    }

    const subtaskIndex = task.subtasks.findIndex(
      (subtask: any) => subtask._id.toString() === req.params.subtaskId,
    );

    if (subtaskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found",
      });
    }

    const subtask = task.subtasks[subtaskIndex];

    if (title !== undefined) subtask.title = title;
    if (completed !== undefined) subtask.completed = completed;

    await task.save();
    await task.populate("assignee", "name email");
    await task.populate("creator", "name email");

    res.json({
      success: true,
      message: "Subtask updated successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Update subtask error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating subtask",
    });
  }
});

// Delete subtask
router.delete("/:id/subtasks/:subtaskId", async (req, res) => {
  try {
    const userId = (req as any).userId;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user is creator or assignee
    if (task.creator.toString() !== userId && task.assignee?.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this task",
      });
    }

    // Remove subtask by filtering out the one with matching ID
    task.subtasks = task.subtasks.filter(
      (subtask: any) => subtask._id.toString() !== req.params.subtaskId,
    );

    await task.save();
    await task.populate("assignee", "name email");
    await task.populate("creator", "name email");

    res.json({
      success: true,
      message: "Subtask deleted successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Delete subtask error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting subtask",
    });
  }
});

export default router;

