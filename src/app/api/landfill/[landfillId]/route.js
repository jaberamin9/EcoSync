
import { connect } from "@/dbConnection/dbConnection";
import Landfill from "@/models/landfill";
import { NextRequest, NextResponse } from "next/server";
var mongoose = require('mongoose');
import { getDataFromToken } from "@/utils/getDataFromToken";
import User from "@/models/user";

connect()

export async function PUT(req, context) {
    try {
        const logedInUser = await getDataFromToken(req);

        if (logedInUser.role == "Landfill Manager") {
            const { capacity } = await req.json()

            console.log(capacity, typeof (capacity))
            if (!mongoose.Types.ObjectId.isValid(context.params.landfillId)) return NextResponse.json({ success: false, error: "Landfill not exists" }, { status: 400 })

            const updateLandfill = await Landfill.findOneAndUpdate({ _id: context.params.landfillId }, { capacity }, { returnDocument: "after" })

            if (!updateLandfill) return NextResponse.json({ success: false, error: "Landfill not exists" }, { status: 400 })

            return NextResponse.json({
                success: true,
                message: "Landfill update successfully",
                data: updateLandfill
            }, { status: 200 })
        }

        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }


        const reqBody = await req.json()

        if (!mongoose.Types.ObjectId.isValid(context.params.landfillId)) return NextResponse.json({ success: false, error: "Landfill not exists" }, { status: 400 })

        const updateLandfill = await Landfill.findOneAndUpdate({ _id: context.params.landfillId }, reqBody, { returnDocument: "after" })

        if (!updateLandfill) return NextResponse.json({ success: false, error: "Landfill not exists" }, { status: 400 })

        // const margeData = await Landfill.
        //     findOne({ _id: updateLandfill._id })
        //     .select("-__v").populate({ path: 'manager', select: '_id username email role', model: User }).exec();


        return NextResponse.json({
            success: true,
            message: "Landfill update successfully",
            data: updateLandfill
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


        if (!mongoose.Types.ObjectId.isValid(context.params.landfillId)) return NextResponse.json({ success: false, error: "Landfill not exists" }, { status: 400 })

        const landfill = await Landfill.findByIdAndDelete({ _id: context.params.landfillId })

        if (!landfill) return NextResponse.json({ success: false, error: "Landfill not exists" }, { status: 400 })

        return NextResponse.json({
            success: true,
            message: `Successfully deleted Landfill ${context.params.landfillId}`
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}