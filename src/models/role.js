import mongoose from "mongoose";
// Schema = mongoose.Schema;

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: [true, "Please provide a role"],
    },
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'permissions'
        }
    ]
})

const Role = mongoose.models.roles || mongoose.model("roles", roleSchema);

export default Role;