import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/utils/get-data-from-token";
import Vehicle from "@/models/vehicle";
import { NextRequest, NextResponse } from "next/server";
var mongoose = require('mongoose');

connect()

export async function PUT(req, context) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            const { isFree } = await req.json()

            if (!mongoose.Types.ObjectId.isValid(context.params.vehicleId)) return NextResponse.json({ success: false, error: "Vehicle not exists" }, { status: 400 })

            const vehicle = await Vehicle.findOneAndUpdate({ _id: context.params.vehicleId }, { isFree }, { returnDocument: "after" })

            if (!vehicle) return NextResponse.json({ success: false, error: "Vehicle not exists" }, { status: 400 })
            return NextResponse.json({
                success: true,
                message: "Vehicle update successfully",
                data: vehicle
            }, { status: 200 })
        }

        const reqBody = await req.json()

        if (!mongoose.Types.ObjectId.isValid(context.params.vehicleId)) return NextResponse.json({ success: false, error: "Vehicle not exists" }, { status: 400 })

        const vehicle = await Vehicle.findOneAndUpdate({ _id: context.params.vehicleId }, reqBody, { returnDocument: "after" })

        if (!vehicle) return NextResponse.json({ success: false, error: "Vehicle not exists" }, { status: 400 })

        return NextResponse.json({
            success: true,
            message: "Vehicle update successfully",
            data: vehicle
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function DELETE(req, context) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        if (!mongoose.Types.ObjectId.isValid(context.params.vehicleId)) return NextResponse.json({ success: false, error: "Vehicle not exists" }, { status: 400 })

        const vehicle = await Vehicle.findByIdAndDelete({ _id: context.params.vehicleId })

        if (!vehicle) return NextResponse.json({ success: false, error: "Vehicle not exists" }, { status: 400 })

        return NextResponse.json({
            success: true,
            message: `Successfully deleted vehicle ${context.params.vehicleId}`
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}