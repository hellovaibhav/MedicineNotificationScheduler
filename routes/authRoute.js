import express from "express";
import { loginUser, registerUser } from "../controllers/user.js";

const authRoute = express.Router();

authRoute.post("/register",registerUser);

authRoute.post("/login",loginUser);

export default authRoute
