import mongoose from "mongoose";

const wceSchema = new mongoose.Schema({
    stsId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'sts'
    }, vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'vehicles'
    }, landfillId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'landfill'
    }, totlaKiloMeter: {
        type: Number,
        required: true,
    }, volumeCollection: {
        type: Number,
        required: true
    }, arrivalTime: {
        type: Date,
        default: Date.now
    }, departureTime: {
        type: Date,
        default: Date.now
    }, running: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Wce = mongoose.models.wce || mongoose.model("wce", wceSchema);

export default Wce;