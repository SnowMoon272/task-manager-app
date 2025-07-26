import mongoose, { Document, Schema } from "mongoose";

export interface ISubtask {
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assignee?: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
  subtasks: ISubtask[];
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  areAllSubtasksCompleted(): boolean;
  getSubtaskProgress(): { completed: number; total: number; percentage: number };
}

const SubtaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Subtask title is required"],
      trim: true,
      maxlength: [200, "Subtask title cannot exceed 200 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Task title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task creator is required"],
    },
    subtasks: [SubtaskSchema],
    dueDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [30, "Tag cannot exceed 30 characters"],
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Middleware pre-save para validar que no se pueda marcar como 'done' si hay subtareas pendientes
TaskSchema.pre("save", function (this: ITask, next) {
  // Solo validar si el status está siendo cambiado a 'done'
  if (
    this.status === "done" &&
    this.subtasks &&
    Array.isArray(this.subtasks) &&
    this.subtasks.length > 0
  ) {
    const incompletedSubtasks = this.subtasks.filter((subtask: ISubtask) => !subtask.completed);

    if (incompletedSubtasks.length > 0) {
      const error = new Error(
        `No se puede marcar la tarea como completada porque tiene ${
          incompletedSubtasks.length
        } subtarea(s) pendiente(s): ${incompletedSubtasks
          .map((s: ISubtask) => s.title)
          .join(", ")}`,
      );
      return next(error);
    }
  }
  next();
});

// Middleware pre-findOneAndUpdate para validar actualizaciones
TaskSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as { status?: string };

  // Si se está intentando cambiar el status a 'done'
  if (update && update.status === "done") {
    // Necesitamos obtener el documento actual para verificar las subtareas
    this.model
      .findOne(this.getQuery())
      .then((task: ITask | null) => {
        if (task && task.subtasks && Array.isArray(task.subtasks) && task.subtasks.length > 0) {
          const incompletedSubtasks = task.subtasks.filter(
            (subtask: ISubtask) => !subtask.completed,
          );

          if (incompletedSubtasks.length > 0) {
            const error = new Error(
              `No se puede marcar la tarea como completada porque tiene ${
                incompletedSubtasks.length
              } subtarea(s) pendiente(s): ${incompletedSubtasks
                .map((s: ISubtask) => s.title)
                .join(", ")}`,
            );
            return next(error);
          }
        }
        next();
      })
      .catch(next);
  } else {
    next();
  }
});

// Método para verificar si todas las subtareas están completadas
TaskSchema.methods.areAllSubtasksCompleted = function (): boolean {
  if (!this.subtasks || this.subtasks.length === 0) {
    return true; // Si no hay subtareas, consideramos que están "completadas"
  }
  return this.subtasks.every((subtask: ISubtask) => subtask.completed);
};

// Método para obtener el progreso de subtareas
TaskSchema.methods.getSubtaskProgress = function (): {
  completed: number;
  total: number;
  percentage: number;
} {
  if (!this.subtasks || this.subtasks.length === 0) {
    return { completed: 0, total: 0, percentage: 100 };
  }

  const completed = this.subtasks.filter((subtask: ISubtask) => subtask.completed).length;
  const total = this.subtasks.length;
  const percentage = Math.round((completed / total) * 100);

  return { completed, total, percentage };
};

// Indexes for better performance
TaskSchema.index({ status: 1 });
TaskSchema.index({ assignee: 1 });
TaskSchema.index({ creator: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ priority: 1 });

export default mongoose.model<ITask>("Task", TaskSchema);

