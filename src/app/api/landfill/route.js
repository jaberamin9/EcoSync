import { connect } from "@/dbConnection/dbConnection";
import Landfill from "@/models/landfill";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/get-data-from-token";
import User from "@/models/user";

connect()


export async function GET(req) {
    try {
        const logedInUser = await getDataFromToken(req);

        if (logedInUser.role === "STS Manager") {
            const landfill = await Landfill.find({ "capacity": { "$gt": 0 } }).select("-__v -manager");

            return NextResponse.json({
                success: true,
                data: landfill
            }, { status: 200 })
        }

        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const landfill = await Landfill.find().select("-__v")
            .populate({ path: 'manager', select: '_id username email role', model: User }).exec();

        return NextResponse.json({
            success: true,
            data: landfill
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
        const { landfillName, operationalTimespan, capacity, latitude, longitude, manager } = reqBody

        //check if user already exists
        const isLandfillExists = await Landfill.findOne({ landfillName })

        if (isLandfillExists) {
            return NextResponse.json({ success: false, error: "Landfill already exists" }, { status: 400 })
        }

        const newLandfill = new Landfill({
            landfillName,
            operationalTimespan,
            capacity,
            latitude,
            longitude,
            manager
        })

        const savedLandfill = await newLandfill.save()

        return NextResponse.json({
            success: true,
            message: "Landfill add successfully",
            data: savedLandfill
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
