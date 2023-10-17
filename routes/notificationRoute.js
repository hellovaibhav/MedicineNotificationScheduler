import express from "express";
import { setNotification } from "../controllers/notification.js";

const notificationRoute = express.Router();

notificationRoute.post("/setNotification", setNotification);

export default notificationRoute;