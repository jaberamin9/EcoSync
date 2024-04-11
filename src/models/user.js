import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    role: {
        type: String,
        enum: ["System Admin", "STS Manager", "Landfill Manager", "Unassigned"],
        default: "Unassigned",
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    otpSecretKey: Object
})

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;