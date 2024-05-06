import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/utils/get-data-from-token";
import Sts from "@/models/sts";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

connect()


export async function GET(req) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role == "STS Manager") {
            const sts = await Sts.find({ 'manager': logedInUser.id }).select("id wardNumber latitude longitude")
                .populate({ path: 'manager', select: '_id', model: User });

            return NextResponse.json({
                success: true,
                sts: sts[0] ? sts[0] : sts
            }, { status: 200 })
        }

        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const sts = await Sts.find().select("-__v")
            .populate({ path: 'manager', select: '_id username email role', model: User }).exec();

        return NextResponse.json({
            success: true,
            sts
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
        const { wardNumber, capacity, latitude, longitude, manager } = reqBody

        //check if user already exists
        const isstsExists = await Sts.findOne({ wardNumber })

        if (isstsExists) {
            return NextResponse.json({ success: false, error: "STS already exists" }, { status: 400 })
        }

        const newSts = new Sts({
            wardNumber,
            capacity,
            latitude,
            longitude,
            manager
        })

        const savedSts = await newSts.save()

        // const margeData = await Sts.
        //     findOne({ _id: savedSts._id })
        //     .select("-__v").populate({ path: 'manager', select: '_id username email role', model: User }).exec();

        return NextResponse.json({
            success: true,
            message: "STS add successfully",
            data: savedSts
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
