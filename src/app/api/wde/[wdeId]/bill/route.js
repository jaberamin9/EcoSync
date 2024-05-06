import { connect } from "@/dbConnection/dbConnection";
import Wde from "@/models/wde";
import { NextRequest, NextResponse } from "next/server";
var mongoose = require('mongoose');
import { getDataFromToken } from "@/utils/get-data-from-token";
import Landfill from "@/models/landfill";
import Sts from "@/models/sts";
import Vehicle from "@/models/vehicle";


connect()


export async function GET(req, context) {
    try {
        const logedInUser = await getDataFromToken(req);
        //only access System Admin and Landfill Manager
        if (logedInUser.role === "STS Manager") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        if (!mongoose.Types.ObjectId.isValid(context.params.wdeId)) return NextResponse.json({ success: false, error: "WDE not exists" }, { status: 400 })

        const wde = await Wde.find({ _id: context.params.wdeId }).select("-__v")
            .populate({ path: 'stsId', select: '-__v', model: Sts })
            .populate({ path: 'vehicleId', select: '-__v -_id -stsId', model: Vehicle })
            .populate({ path: 'landfillId', select: '-__v', model: Landfill });

        if (!wde) return NextResponse.json({ success: false, error: "WDE not exists" }, { status: 400 })

        const costPerKilometer = (wde[0].vehicleId.fuelcostUnloaded + (wde[0].volumeDisposed / wde[0].vehicleId.capacity) * (wde[0].vehicleId.fuelcostLoaded - wde[0].vehicleId.fuelcostUnloaded))
        const totalFuelCost = costPerKilometer * wde[0].totlaKiloMeter

        console.log(wde)
        const res = {
            time: new Date(),
            truckDetails: wde[0].vehicleId,
            volumeDisposed: wde[0].volumeDisposed,
            totalFuelCost,
            totalFuel: wde[0].totlaKiloMeter
        }

        return NextResponse.json({
            success: true,
            message: "Bill detail",
            data: res
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}