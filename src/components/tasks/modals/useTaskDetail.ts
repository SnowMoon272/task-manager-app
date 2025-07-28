import { useState, useEffect, useCallback } from "react";
import { Task, Subtask, Comment } from "@/types";
import { useAuthStore } from "@/store/auth";

interface UseTaskDetailProps {
  task: Task | null;
  isOpen: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onUpdateSubtasks?: (taskId: string, subtasks: Task["subtasks"]) => void;
  onClose: () => void;
}

export const useTaskDetail = ({
  task,
  isOpen,
  onEdit,
  onDelete,
  onUpdateSubtasks,
  onClose,
}: UseTaskDetailProps) => {
  // Estados de UI
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);

  // Estados de subtareas
  const [isCreatingSubtask, setIsCreatingSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  // Estados de edición de tarea
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedPriority, setEditedPriority] = useState<"low" | "medium" | "high">("medium");
  const [editedStatus, setEditedStatus] = useState<"todo" | "in-progress" | "done">("todo");

  // Estados de comentarios
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  // Estados de modales de confirmación
  const [showIncompleteSubtasksAlert, setShowIncompleteSubtasksAlert] = useState(false);
  const [showSubtaskBlockAlert, setShowSubtaskBlockAlert] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteCommentConfirmation, setShowDeleteCommentConfirmation] = useState(false);
  const [showDeleteSubtaskConfirmation, setShowDeleteSubtaskConfirmation] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [subtaskToDelete, setSubtaskToDelete] = useState<{ index: number; title: string } | null>(
    null,
  );

  const { user } = useAuthStore();

  // Efectos
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (task && isOpen) {
      setEditedTitle(task.title);
      setEditedDescription(task.description || "");
      setEditedPriority(task.priority);
      setEditedStatus(task.status);
    }
  }, [task, isOpen]);

  // Funciones de utilidad
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const hasIncompleteSubtasks = useCallback((task: Task) => {
    return (
      task.subtasks &&
      task.subtasks.length > 0 &&
      task.subtasks.some((subtask) => !subtask.completed)
    );
  }, []);

  // Funciones de manejo
  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  }, [onClose]);

  const handleEditTask = useCallback(() => {
    setIsEditingTask(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editedTitle.trim() && task) {
      if (editedStatus === "done" && hasIncompleteSubtasks(task)) {
        setShowIncompleteSubtasksAlert(true);
        return;
      }

      const updatedTask = {
        ...task,
        title: editedTitle.trim(),
        description: editedDescription.trim() || undefined,
        priority: editedPriority,
        status: editedStatus,
      };

      if (onEdit) {
        onEdit(updatedTask);
      }

      setIsEditingTask(false);
    }
  }, [
    editedTitle,
    editedDescription,
    editedPriority,
    editedStatus,
    task,
    hasIncompleteSubtasks,
    onEdit,
  ]);

  const handleCancelEdit = useCallback(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description || "");
      setEditedPriority(task.priority);
      setEditedStatus(task.status);
    }
    setIsEditingTask(false);
  }, [task]);

  const handleDelete = useCallback(() => {
    setShowDeleteConfirmation(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (onDelete && task) {
      onDelete(task._id);
      handleClose();
    }
    setShowDeleteConfirmation(false);
  }, [onDelete, task, handleClose]);

  // Funciones de subtareas
  const handleToggleSubtask = useCallback(
    (subtaskIndex: number) => {
      if (task) {
        const currentSubtask = task.subtasks[subtaskIndex];
        const wouldBecomePending = currentSubtask.completed && task.status === "done";

        if (wouldBecomePending) {
          setShowSubtaskBlockAlert(true);
          return;
        }

        const updatedSubtasks = task.subtasks.map((subtask, index) => {
          if (index === subtaskIndex) {
            return {
              ...subtask,
              completed: !subtask.completed,
            };
          }
          return subtask;
        });

        const updatedTask = {
          ...task,
          subtasks: updatedSubtasks,
        };

        if (onUpdateSubtasks) {
          onUpdateSubtasks(task._id, updatedSubtasks);
        } else if (onEdit) {
          onEdit(updatedTask);
        }
      }
    },
    [task, onUpdateSubtasks, onEdit],
  );

  const handleCreateSubtask = useCallback(() => {
    if (newSubtaskTitle.trim() && task) {
      const isTaskCompleted = task.status === "done";

      const newSubtask: Subtask = {
        _id: `temp-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        completed: isTaskCompleted,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedSubtasks = [...(task.subtasks || []), newSubtask];
      const updatedTask = {
        ...task,
        subtasks: updatedSubtasks,
      };

      if (onUpdateSubtasks) {
        onUpdateSubtasks(task._id, updatedSubtasks);
      } else if (onEdit) {
        onEdit(updatedTask);
      }

      setNewSubtaskTitle("");
      setIsCreatingSubtask(false);
    }
  }, [newSubtaskTitle, task, onUpdateSubtasks, onEdit]);

  const handleDeleteSubtask = useCallback((subtaskIndex: number, subtaskTitle: string) => {
    setSubtaskToDelete({ index: subtaskIndex, title: subtaskTitle });
    setShowDeleteSubtaskConfirmation(true);
  }, []);

  const confirmDeleteSubtask = useCallback(() => {
    if (task && subtaskToDelete) {
      const updatedSubtasks = task.subtasks.filter((_, index) => index !== subtaskToDelete.index);
      const updatedTask = {
        ...task,
        subtasks: updatedSubtasks,
      };

      if (onUpdateSubtasks) {
        onUpdateSubtasks(task._id, updatedSubtasks);
      } else if (onEdit) {
        onEdit(updatedTask);
      }
    }
    setShowDeleteSubtaskConfirmation(false);
    setSubtaskToDelete(null);
  }, [task, subtaskToDelete, onUpdateSubtasks, onEdit]);

  // Funciones de comentarios
  const handleCreateComment = useCallback(() => {
    if (newCommentText.trim() && task && user) {
      const newComment: Comment = {
        text: newCommentText.trim(),
        author: user._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedComments = [...(task.comments || []), newComment];
      const updatedTask = {
        ...task,
        comments: updatedComments,
      };

      if (onEdit) {
        onEdit(updatedTask);
      }

      setNewCommentText("");
      setIsCreatingComment(false);
    }
  }, [newCommentText, task, user, onEdit]);

  const handleEditComment = useCallback(
    (commentId: string) => {
      if (task) {
        const comment = task.comments?.find((c) => c._id === commentId);
        if (comment) {
          setEditingCommentId(commentId);
          setEditedCommentText(comment.text);
        }
      }
    },
    [task],
  );

  const handleSaveCommentEdit = useCallback(() => {
    if (editedCommentText.trim() && task && editingCommentId) {
      const updatedComments =
        task.comments?.map((comment) =>
          comment._id === editingCommentId
            ? { ...comment, text: editedCommentText.trim(), updatedAt: new Date().toISOString() }
            : comment,
        ) || [];

      const updatedTask = {
        ...task,
        comments: updatedComments,
      };

      if (onEdit) {
        onEdit(updatedTask);
      }

      setEditingCommentId(null);
      setEditedCommentText("");
    }
  }, [editedCommentText, task, editingCommentId, onEdit]);

  const handleDeleteComment = useCallback((commentId: string) => {
    setCommentToDelete(commentId);
    setShowDeleteCommentConfirmation(true);
  }, []);

  const confirmDeleteComment = useCallback(() => {
    if (task && commentToDelete) {
      const updatedComments =
        task.comments?.filter((comment) => comment._id !== commentToDelete) || [];
      const updatedTask = {
        ...task,
        comments: updatedComments,
      };

      if (onEdit) {
        onEdit(updatedTask);
      }
    }
    setShowDeleteCommentConfirmation(false);
    setCommentToDelete(null);
  }, [task, commentToDelete, onEdit]);

  return {
    // Estados de UI
    isVisible,
    isAnimating,
    isEditingTask,

    // Estados de subtareas
    isCreatingSubtask,
    setIsCreatingSubtask,
    newSubtaskTitle,
    setNewSubtaskTitle,

    // Estados de edición
    editedTitle,
    setEditedTitle,
    editedDescription,
    setEditedDescription,
    editedPriority,
    setEditedPriority,
    editedStatus,
    setEditedStatus,

    // Estados de comentarios
    isCreatingComment,
    setIsCreatingComment,
    newCommentText,
    setNewCommentText,
    editingCommentId,
    editedCommentText,
    setEditedCommentText,

    // Estados de modales
    showIncompleteSubtasksAlert,
    setShowIncompleteSubtasksAlert,
    showSubtaskBlockAlert,
    setShowSubtaskBlockAlert,
    showDeleteConfirmation,
    showDeleteCommentConfirmation,
    showDeleteSubtaskConfirmation,
    commentToDelete,
    subtaskToDelete,

    // Funciones
    formatDate,
    handleClose,
    handleEditTask,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    confirmDelete,
    handleToggleSubtask,
    handleCreateSubtask,
    handleDeleteSubtask,
    confirmDeleteSubtask,
    handleCreateComment,
    handleEditComment,
    handleSaveCommentEdit,
    handleDeleteComment,
    confirmDeleteComment,

    // Funciones de cancelación
    cancelDelete: () => setShowDeleteConfirmation(false),
    cancelDeleteComment: () => setShowDeleteCommentConfirmation(false),
    cancelDeleteSubtask: () => {
      setShowDeleteSubtaskConfirmation(false);
      setSubtaskToDelete(null);
    },
    handleCancelCommentEdit: () => {
      setEditingCommentId(null);
      setEditedCommentText("");
    },
  };
};

