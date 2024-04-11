import mongoose from "mongoose";

const permissionsSchema = new mongoose.Schema({
    permissionsName: {
        type: String,
        required: [true, "Please provide a permissions Name"]
    },
    permissionsValue: [
        {
            type: String,
            required: false,
            default: "read"
            //read, write, update, delete
        }
    ]
})

const Permissions = mongoose.models.permissions || mongoose.model("permissions", permissionsSchema);

export default Permissions;