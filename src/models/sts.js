import mongoose from "mongoose";

const stsSchema = new mongoose.Schema({
    wardNumber: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
        //capacity in Tonnes
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    manager: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'users'
        }
    ]
})

const Sts = mongoose.models.sts || mongoose.model("sts", stsSchema);

export default Sts;