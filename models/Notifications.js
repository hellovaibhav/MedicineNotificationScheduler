import mongoose from "mongoose";
import Users from "./Users";
const notificationSchema = new mongoose.Schema({

    userId: {
        type: Schema.ObjectId,
        ref: Users,
        required: true,
    },
    medicineName: {
        type: String,
        required: true
    },
    reminderTimes: [String],
}, { timestamp: true });

notificationSchema.index({ field1: 1, field2: 1 }, { unique: true });

export default mongoose.model("Notifications", notificationSchema);