import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/utils/get-data-from-token";
import Vehicle from "@/models/vehicle";
import { NextRequest, NextResponse } from "next/server";
import Sts from "@/models/sts";

connect()


export async function GET(req) {
    try {
        const logedInUser = await getDataFromToken(req);

        if (logedInUser.role == "STS Manager") {
            const vehicles = await Vehicle.find().select("-__v")
                .populate({ path: 'stsId', select: '-__v', model: Sts, match: { manager: { $eq: logedInUser.id } } })

            const newVehicles = vehicles.filter((item) => {
                return item.stsId != null
            })

            return NextResponse.json({
                success: true,
                vehicles: newVehicles
            }, { status: 200 })
        }

        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const vehicles = await Vehicle.find().select("-__v")
            .populate({ path: 'stsId', select: '-__v', model: Sts })


        return NextResponse.json({
            success: true,
            vehicles
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const reqBody = await req.json()
        const { vehicleId, type, capacity, fuelcostLoaded, fuelcostUnloaded, stsId } = reqBody

        //check if user already exists
        const vehicle = await Vehicle.findOne({ vehicleId })

        if (vehicle) {
            return NextResponse.json({ success: false, error: "Vehicle already exists" }, { status: 400 })
        }

        const newVehicle = new Vehicle({
            vehicleId,
            type,
            capacity,
            fuelcostLoaded,
            fuelcostUnloaded,
            stsId
        })

        const savedVehicle = await newVehicle.save()

        return NextResponse.json({
            success: true,
            message: "Vehicle add successfully",
            data: savedVehicle
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
