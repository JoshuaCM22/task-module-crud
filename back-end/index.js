import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import helperMethods from "./utility/helperMethods.js";

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT;
const ENVIRONMENT = process.env.APP_ENVIRONMENT;

if (ENVIRONMENT === "development") app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: "*",
}));


app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use(notFound);
app.use(errorHandler);


const url = process.env.PROTOCOL + process.env.DOMAIN + ':' + PORT;
app.listen(PORT, helperMethods.setDatabaseConnection(url, ENVIRONMENT, PORT));