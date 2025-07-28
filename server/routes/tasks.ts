import { Router, Request } from "express";
import Task from "../models/Task";
import { authenticateToken } from "../middleware/auth";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

interface TaskFilter {
  $or?: Array<{ creator: string } | { assignee: string }>;
  status?: string;
  priority?: string;
  assignee?: string;
}

interface SubtaskInput {
  title: string;
  completed?: boolean;
}

interface CommentInput {
  _id?: string;
  text: string;
  author: string;
}

interface ProcessedComment {
  _id?: string;
  text: string;
  author: string;
}

interface UpdateTaskBody {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  subtasks?: SubtaskInput[];
  comments?: CommentInput[];
}

interface CreateTaskBody {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  dueDate?: string;
  tags?: string[];
}

interface AddSubtaskBody {
  title: string;
}

interface UpdateSubtaskBody {
  title?: string;
  completed?: boolean;
}

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all tasks for authenticated user
router.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    const { status, priority, assignee } = req.query;
    const userId = req.userId;
    const filter: TaskFilter = {
      // Only show tasks where user is creator or assignee
      $or: [{ creator: userId! }, { assignee: userId! }],
    };

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
      .populate("comments.author", "name email")
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
router.get("/:id", async (req: AuthenticatedRequest, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignee", "name email")
      .populate("creator", "name email")
      .populate("comments.author", "name email");

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
router.post("/", async (req: AuthenticatedRequest, res) => {
  try {
    const { title, description, status, priority, assignee, dueDate, tags }: CreateTaskBody =
      req.body;
    const userId = req.userId;

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
    await task.populate("comments.author", "name email");

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
router.put("/:id", async (req: AuthenticatedRequest, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      assignee,
      dueDate,
      tags,
      subtasks,
      comments,
    }: UpdateTaskBody = req.body;
    const userId = req.userId;

    console.log("Update task request:", {
      taskId: req.params.id,
      userId,
      body: req.body,
      subtasks: subtasks ? `${subtasks.length} subtasks` : "no subtasks",
      comments: comments ? `${comments.length} comments` : "no comments",
    });

    const task = await Task.findById(req.params.id);

    if (!task) {
      console.log("Task not found:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user is creator or assignee
    console.log("Update task authorization:", {
      taskId: req.params.id,
      userId,
      taskCreator: task.creator?.toString(),
      taskAssignee: task.assignee?.toString(),
      userIsCreator: task.creator.toString() === userId,
      userIsAssignee: task.assignee && task.assignee.toString() === userId,
    });

    if (task.creator.toString() !== userId && task.assignee?.toString() !== userId) {
      console.log("Authorization failed for task update");
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    const updateData: Record<string, unknown> = {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(assignee && { assignee }),
      ...(dueDate && { dueDate }),
      ...(tags && { tags }),
    };

    // Manejo especial para subtareas
    if (subtasks !== undefined) {
      // Filtrar subtareas válidas y extraer solo los campos necesarios
      const validSubtasks = subtasks
        .filter((st: SubtaskInput) => st && st.title && st.title.trim())
        .map((st: SubtaskInput) => ({
          title: st.title.trim(),
          completed: Boolean(st.completed),
        }));

      updateData.subtasks = validSubtasks;
      console.log("Processed subtasks:", validSubtasks);
    }

    // Manejo especial para comentarios
    if (comments !== undefined) {
      const validComments = comments
        .filter(
          (comment: CommentInput) =>
            comment && comment.text && comment.text.trim() && comment.author,
        )
        .map((comment: CommentInput): ProcessedComment => {
          const isTemporaryId = comment._id && comment._id.startsWith("temp-");
          const commentData: ProcessedComment = {
            text: comment.text.trim(),
            author: comment.author,
          };
          if (comment._id && !isTemporaryId) {
            commentData._id = comment._id;
          }
          return commentData;
        });

      updateData.comments = validComments;
      console.log("Processed comments:", validComments);
    }

    console.log("Final update data:", updateData);

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("assignee", "name email")
      .populate("creator", "name email")
      .populate("comments.author", "name email");

    res.json({
      success: true,
      message: "Task updated successfully",
      data: {
        task: updatedTask,
        subtaskProgress: updatedTask?.getSubtaskProgress(),
      },
    });
  } catch (error: unknown) {
    console.error("Update task error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });

    // Si es un error de validación de Mongoose
    if (error && typeof error === "object" && "name" in error && error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error,
      });
    }

    // Si es un error de validación de subtareas
    if (
      error instanceof Error &&
      error.message &&
      error.message.includes("subtarea(s) pendiente(s)")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
        code: "INCOMPLETE_SUBTASKS",
      });
    }

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Error updating task",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
});

// Delete task
router.delete("/:id", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
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
router.post("/:id/subtasks", async (req: AuthenticatedRequest, res) => {
  try {
    const { title }: AddSubtaskBody = req.body;
    const userId = req.userId;

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
    await task.populate("comments.author", "name email");

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
router.put("/:id/subtasks/:subtaskId", async (req: AuthenticatedRequest, res) => {
  try {
    const { title, completed }: UpdateSubtaskBody = req.body;
    const userId = req.userId;

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
      (subtask) =>
        (subtask as unknown as { _id: { toString(): string } })._id.toString() ===
        req.params.subtaskId,
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
    await task.populate("comments.author", "name email");

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
router.delete("/:id/subtasks/:subtaskId", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;

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
      (subtask) =>
        (subtask as unknown as { _id: { toString(): string } })._id.toString() !==
        req.params.subtaskId,
    );

    await task.save();
    await task.populate("assignee", "name email");
    await task.populate("creator", "name email");
    await task.populate("comments.author", "name email");

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

