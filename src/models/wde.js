import mongoose from "mongoose";

const WdeSchema = new mongoose.Schema({
    landfillId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'landfill'
    },
    stsId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'sts'
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'vehicles'
    },
    volumeDisposed: {
        type: Number,
        required: true
    },
    arrivalTime: {
        type: Date,
        default: Date.now
    },
    departureTime: {
        type: Date,
        default: Date.now
    }, totlaKiloMeter: {
        type: Number,
        required: true,
    }
}, { timestamps: true })

const Wde = mongoose.models.wde || mongoose.model("wde", WdeSchema);

export default Wde;