import asyncHandler from "express-async-handler";
import model from "../models/taskModel.js";
import helperMethods from "../utility/helperMethods.js";

// @desc    Get all the tasks
// @route   GET /api/tasks/get-tasks
const getTasks = asyncHandler(async (req, res) => {
  try {
    return res.status(200).json(await model.getTasks(helperMethods.getUserID(req.headers.authorization)));
  }
  catch (error) {
    return res.status(500).json("An error has occured in getTasks(). Error Message: " + error.message);
  }
});

// @desc    Get a task by Task ID 
// @route   GET /api/tasks/get-task/:id
const getTask = asyncHandler(async (req, res) => {
  try {
    if (!helperMethods.hasValidValue(req.params.id)) return res.status(422).json("id params is required in the payload.");
    return res.status(200).json(await model.getTask(helperMethods.getUserID(req.headers.authorization), req.params.id));
  }
  catch (error) {
    return res.status(500).json("An error has occured in getTask(). Error Message: " + error.message);
  }
});

// @desc    Create a new task
// @route   POST /api/tasks/create-task
const createTask = asyncHandler(async (req, res) => {
  try {

   const payload = { ...req.body };

   if (!helperMethods.hasValidValue(payload.title)) return res.status(422).json("title is required in the payload.");
   if (!helperMethods.hasValidValue(payload.description)) return res.status(422).json("description is required in the payload.");
   if (!helperMethods.hasValidValue(payload.due_date)) return res.status(422).json("due date is required in the payload.");

    await model.createTask(helperMethods.getUserID(req.headers.authorization), { ...req.body });
    return res.status(201).json("Successfully created a task");
  }
  catch (error) {
    return res.status(500).json('An error has occured in createTask(). Error Message: ' + error.message);
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/update-task/:id
const updateTask = asyncHandler(async (req, res) => {
  try {
    if (!helperMethods.hasValidValue(req.params.id)) return res.status(422).json("id params is required in the payload.");
    const payload = { ...req.body };
    if (!helperMethods.hasValidValue(payload.title)) return res.status(422).json("title is required in the payload.");
    if (!helperMethods.hasValidValue(payload.description)) return res.status(422).json("description is required in the payload.");
    if (!helperMethods.hasValidValue(payload.due_date)) return res.status(422).json("due date is required in the payload.");

    await model.updateTask(helperMethods.getUserID(req.headers.authorization), req.params.id, { ...req.body });
    return res.status(200).json("Successfully updated a task");
  }
  catch (error) {
    return res.status(500).json('An error has occured in updateTask(). Error Message: ' + error.message);
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/delete-task/:id
const deleteTask = asyncHandler(async (req, res) => {
  try {
    if (!helperMethods.hasValidValue(req.params.id)) return res.status(422).json("id params is required in the payload.");
    const userID = helperMethods.getUserID(req.headers.authorization);
    const createdBy = await model.getCreatedBy(req.params.id);
    if (userID !== createdBy) return res.status(422).json("you do not have the access right to delete the others task.");
    await model.deleteTask(req.params.id);
    return res.status(200).json("Successfully deleted a task");
  }
  catch (error) {
    return res.status(500).json('An error has occured in deleteTask(). Error Message: ' + error.message);
  }
});

export {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
