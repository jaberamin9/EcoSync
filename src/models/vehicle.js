import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    vehicleId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
        //Open Truck, Dump Truck, Compactor, Container 
    },
    capacity: {
        type: Number,
        required: true
    },
    fuelcostLoaded: {
        type: Number,
        required: true
        //Fuel cost per kilo meter - loaded
    },
    fuelcostUnloaded: {
        type: Number,
        required: true
        //Fuel cost per kilo meter - unloaded
    },
    stsId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'sts'
    }

})

const Vehicle = mongoose.models.vehicles || mongoose.model("vehicles", vehicleSchema);

export default Vehicle;