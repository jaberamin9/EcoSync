import { connect } from "@/dbConnection/dbConnection";
import Wde from "@/models/wde";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/get-data-from-token";
import Sts from "@/models/sts";
import Vehicle from "@/models/vehicle";
import Landfill from "@/models/landfill";


connect()


export async function GET(req) {
    try {
        const logedInUser = await getDataFromToken(req);
        //only access System Admin and Landfill Manager
        if (logedInUser.role === "STS Manager") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }
        if (logedInUser.role === "Landfill Manager") {
            const wde = await Wde.find().select("-__v")
                .populate({ path: 'stsId', select: '-__v', model: Sts }).populate({ path: 'vehicleId', select: '-__v', model: Vehicle })
                .populate({ path: 'landfillId', select: '-__v', model: Landfill, match: { manager: { $eq: logedInUser.id } } })
                .sort({ 'departureTime': 1 });

            const newWce = wde.filter((item) => {
                return item.landfillId != null
            })

            return NextResponse.json({
                success: true,
                data: newWce,
            }, { status: 200 })
        }


        const wde = await Wde.find().select("-__v")
            .populate({ path: 'stsId', select: '-__v', model: Sts })
            .populate({ path: 'vehicleId', select: '-__v', model: Vehicle })
            .populate({ path: 'landfillId', select: '-__v', model: Landfill });

        return NextResponse.json({
            success: true,
            data: wde
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const logedInUser = await getDataFromToken(req);
        //only access System Admin and Landfill Manager
        if (logedInUser.role === "STS Manager") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const reqBody = await req.json()
        const { landfillId, stsId, vehicleId, volumeDisposed, arrivalTime, departureTime, totlaKiloMeter } = reqBody

        if (!landfillId || !stsId || !vehicleId || !volumeDisposed || !arrivalTime || !departureTime || !totlaKiloMeter) {
            return NextResponse.json({ success: false, message: "field are missing" }, { status: 400 })
        }

        const newWde = new Wde({
            landfillId,
            stsId,
            vehicleId,
            volumeDisposed,
            arrivalTime,
            departureTime,
            totlaKiloMeter
        })

        const savedWde = await newWde.save()

        return NextResponse.json({
            success: true,
            message: "WDE add successfully",
            data: savedWde
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}