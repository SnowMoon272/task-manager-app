import { Router } from "express";
import User from "../models/User";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all users (for assignee selection)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "name email avatar role").sort({ name: 1 });

    res.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "name email avatar role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
    });
  }
});

export default router;

