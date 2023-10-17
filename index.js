import express from "express";
import schedule from "node-schedule";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import homeRoute from "./routes/homeRoute.js";

const app = express();

dotenv.config();

const port = 3000;

app.use(express.json());

const connect = () => {
    try {
        mongoose.connect(process.env.MONGO);
        console.log("Connected to database");
    } catch (err) {
        throw err;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("Database is disconnected");
});

// routes
app.use("/", homeRoute)
app.use("/auth", authRoute)

app.listen(port, () => {
    connect();
    console.log(`Server is up and runnning on port ${port}`);
});