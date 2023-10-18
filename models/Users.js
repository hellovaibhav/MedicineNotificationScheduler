import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        unique: true,
        required: true
    },
    careTakerName: {
        type: String
    },
    careTakePhone: {
        type: Number
    },
    careTakerEmail: {
        type: String
    }
}, { timestamp: true }
);

export default mongoose.model("User", userSchema);