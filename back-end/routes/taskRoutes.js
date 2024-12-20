import express from "express";
const router = express.Router();
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} from "../controllers/taskController.js";
import { validateAccessToken } from "../middleware/authMiddleware.js";

router.route("/get-tasks").get(validateAccessToken, getTasks);
router.route("/get-task/:id").get(validateAccessToken, getTask);
router.route("/create-task").post(validateAccessToken, createTask);
router.route("/update-task/:id").put(validateAccessToken, updateTask);
router.route("/delete-task/:id").delete(validateAccessToken, deleteTask);

export default router;
