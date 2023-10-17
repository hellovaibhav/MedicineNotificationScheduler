import mongoose from "mongoose";
import Users from "./Users.js";
const notificationSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
        required: true,
    },
    medicineName: {
        type: String,
        required: true
    },
    reminderTimes: [String],
}, { timestamps: true });

notificationSchema.index({ userId: 1, medicineName: 1 }, { unique: true });

export default mongoose.model("Notifications", notificationSchema);