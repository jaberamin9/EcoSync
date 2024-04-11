import mongoose from "mongoose";

const landfillSchema = new mongoose.Schema({
    landfillName: {
        type: String,
        required: true
    },
    operationalTimespan: {
        type: String,
        required: false
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

const Landfill = mongoose.models.landfill || mongoose.model("landfill", landfillSchema);

export default Landfill;