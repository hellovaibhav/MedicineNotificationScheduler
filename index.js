import express from "express";
import cron from "node-schedule";
import dotenv from "dotenv";
import mongoose from "mongoose";
import moment from "moment";
import cookieParser from "cookie-parser";
// routes
import authRoute from "./routes/authRoute.js";
import homeRoute from "./routes/homeRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import Notifications from "./models/Notifications.js";

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

app.use(cookieParser());

mongoose.connection.on("disconnected", () => {
    console.log("Database is disconnected");
});

cron.scheduleJob('* * * * *', async () => {
    try {
        const currentTime = moment().format('HH:mm');

        const notifications = await Notifications.find({ reminderTimes: currentTime });

        if (notifications.length != 0) {
            console.log("message sent");
        }
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

// routes
app.use("/", homeRoute);
app.use("/auth", authRoute);
app.use("/notify", notificationRoute);

app.listen(port, () => {
    connect();
    console.log(`Server is up and runnning on port ${port}`);
});