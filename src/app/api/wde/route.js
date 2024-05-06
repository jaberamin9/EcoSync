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
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
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
                wde: newWce,
            }, { status: 200 })
        }


        const wde = await Wde.find().select("-__v")
            .populate({ path: 'stsId', select: '-__v', model: Sts })
            .populate({ path: 'vehicleId', select: '-__v', model: Vehicle })
            .populate({ path: 'landfillId', select: '-__v', model: Landfill });

        return NextResponse.json({
            success: true,
            wde
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const logedInUser = await getDataFromToken(req);
        //only access System Admin and Landfill Manager
        if (logedInUser.role === "STS Manager") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const reqBody = await req.json()
        const { landfillId, stsId, vehicleId, volumeDisposed, arrivalTime, departureTime, totlaKiloMeter } = reqBody

        //check if user already exists
        // const isWceExists = await Wce.findOne({ stsId })

        // if (isWceExists) {
        //     return NextResponse.json({ success: false, error: "WCE already exists" }, { status: 400 })
        // }

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

        // const margeData = await Wde.
        //     findOne({ _id: savedWde._id }).select("-__v")
        //     .populate({ path: 'stsId', select: '-__v', model: Sts }).populate({ path: 'vehicleId', select: '-__v', model: Vehicle }).populate({ path: 'landfillId', select: '-__v', model: Landfill });

        return NextResponse.json({
            success: true,
            message: "WDE add successfully",
            data: savedWde
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}


function extractKeyValue(str) {
    // Remove curly braces and split by '=>'
    const pairs = str.replace(/\+/g, ' ').split(/\s*=\s*/);
    // Extract key and value
    const key = pairs[0];
    const value = pairs[1];
    return { key, value };
}