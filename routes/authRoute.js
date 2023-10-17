import express from "express";
import { registerUser } from "../controllers/user.js";

const authRoute = express.Router();

authRoute.post("/register",registerUser);

export default authRoute
