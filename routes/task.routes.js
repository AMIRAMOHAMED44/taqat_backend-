import express from "express";
import {
  createTask,
  deleteTaskByID,
  getAllTasks,
  getSubMainName,    
  getTaskByID,
  printTasks,
  updateTask,
} from "../controller/task.controller.js";
import { createTaskValidation } from "../service/task.validation.js";
import { validation } from "../middleware/validate.js";
import { authentication } from "../middleware/auth.js";

const taskRoutes = express.Router();

taskRoutes.route('/export').get(printTasks);

taskRoutes.use(authentication);

taskRoutes
  .route("/create-task")
  .post(validation(createTaskValidation), createTask);

taskRoutes.route("/").get(getAllTasks);

taskRoutes.route('/get-submain/:id').get(getSubMainName);

taskRoutes
  .route("/:id")
  .get(getTaskByID)
  .patch(updateTask)
  .delete(deleteTaskByID);

export default taskRoutes;
