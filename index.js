import express from "express";
import cron from "node-schedule";
import dotenv from "dotenv";
import mongoose from "mongoose";
import moment from "moment";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import twilio from "twilio";
// routes
import authRoute from "./routes/authRoute.js";
import homeRoute from "./routes/homeRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import Notifications from "./models/Notifications.js";

const app = express();

dotenv.config();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


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


const senderMail = process.env.MAILID;
const senderPass = process.env.MAILPASS;

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, //ssl
    auth: {
        user: senderMail,
        pass: senderPass,
    },
});


cron.scheduleJob('* * * * *', async () => {
    try {
        const currentTime = moment().format('HH:mm');

        const notifications = await Notifications.find({ reminderTimes: currentTime }).populate("userId");

        if (notifications.length != 0) {


            for (let cntr = 0; cntr < notifications.length; cntr++) {

                const target = notifications[cntr];
                console.log(target);


                // email sending to the user
                var mailOptions = {
                    from: senderMail,
                    to: target.userId.email,
                    subject: `Time for your  ${target.medicineName}`,
                    text: `${target.userId.name} it's time for you to take your dose of ${target.medicineName}, if you no longer take this medicine please delete this reminder from the website`,
                    html: `<html><body align=\"center\" bgcolor=\"#EDF1D6\"><br><h3> Hey ${target.userId.name} its time for your dose of </h3><br><h1>${target.medicineName}</h1><br><p>If you no longer take this medicine, kindly delete the notification setting from your account</p> <br><br><p align=\"left\"> This is a system generated email. Please do not reply to this message. </p> <br><br><div align=\"left\"><h4>Medicine Notifier</h4><h5>Reminder Mail <br>dev.vbhv@gmail.com<br></h5><h6>IIIT Ranchi, Ranchi, Jharkhand</h6></div></body></html>`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(`Email Sent to ${target.userId.name}`);
                    }
                });

                // SMS sending to User

                try {
                    await client.messages
                        .create({
                            body: `${target.userId.name} it's time for you to take your dose of ${target.medicineName}, if you no longer take this medicine please delete this reminder from the website`,
                            from: process.env.PHONE_NUMBER,
                            to: `+91${target.userId.phone}`
                        })
                } catch (err) {

                    console.log(err);
                }

                if (target.userId.careTakerEmail != undefined) {
                    var mailOptions = {
                        from: senderMail,
                        to: target.userId.careTakerEmail,
                        subject: `Time for ${target.userId.name}'s  ${target.medicineName}`,
                        text: `$ Hey care taker of ${target.userId.name} it's time for him/her to take the dose of ${target.medicineName}, if he/she no longer take's this medicine please delete this reminder`,
                        html: `<html><body align=\"center\" bgcolor=\"#EDF1D6\"><br><h3> Hey care taker of ${target.userId.name} its time for him/her to take dose of </h3><br><h1>${target.medicineName}</h1><br><p>If he/she no longer take's this medicine, kindly delete the notification setting from your account</p> <br><br><p align=\"left\"> This is a system generated email. Please do not reply to this message. </p> <br><br><div align=\"left\"><h4>Medicine Notifier</h4><h5>Reminder Mail <br>dev.vbhv@gmail.com<br></h5><h6>IIIT Ranchi, Ranchi, Jharkhand</h6></div></body></html>`
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Email Sent to caretaker");
                        }
                    });
                }
                if (target.userId.careTakerPhone != undefined) {
                    try {
                        await client.messages
                            .create({
                                body: `$ Hey care taker of ${target.userId.name} it's time for him/her to take the dose of ${target.medicineName}, if he/she no longer take's this medicine please delete this reminder`,
                                from: process.env.PHONE_NUMBER,
                                to: `+91${target.userId.careTakerPhone}`
                            })
                    } catch (err) {
                        console.log(err);
                    }
                }


            }

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