import express from "express";
import cron from "node-schedule";
import dotenv from "dotenv";
import mongoose from "mongoose";

// routes
import authRoute from "./routes/authRoute.js";
import homeRoute from "./routes/homeRoute.js";
import notificationRoute from "./routes/notificationRoute.js";

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
app.use("/", homeRoute);
app.use("/auth", authRoute);
app.use("/notify", notificationRoute);

app.listen(port, () => {
    connect();
    console.log(`Server is up and runnning on port ${port}`);
});