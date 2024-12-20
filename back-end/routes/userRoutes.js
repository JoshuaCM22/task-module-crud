import express from "express";
const router = express.Router();
import {
  login
} from "../controllers/userController.js";

router.route("/login").post(login); 

export default router;
