import { connect } from "@/dbConnection/dbConnection";
import Landfill from "@/models/landfill";
import { NextRequest, NextResponse } from "next/server";
var mongoose = require('mongoose');
import { getDataFromToken } from "@/utils/get-data-from-token";

connect()

export async function PUT(req, context) {
    try {
        const params = req.nextUrl.searchParams
        const logedInUser = await getDataFromToken(req);
        console.log(params)

        if (logedInUser.role == "STS Manager" || params.get('update') === 'updateCapacity') {
            const { capacity } = await req.json()
            console.log(capacity)

            if (!mongoose.Types.ObjectId.isValid(context.params.landfillId)) return NextResponse.json({ success: false, message: "Landfill not exists" }, { status: 400 })
            const currentCapacity = await Landfill.findOne({ _id: context.params.landfillId })
            if ((currentCapacity.capacity - capacity) < 0) {
                return NextResponse.json({ success: false, message: "not enough space" }, { status: 400 })
            }
            const updateLandfill = await Landfill.findOneAndUpdate({ _id: context.params.landfillId }, { $set: { capacity: (currentCapacity.capacity - capacity) } }, { returnDocument: "after" })

            return NextResponse.json({
                success: true,
                message: "Landfill update successfully",
                data: updateLandfill
            }, { status: 200 })
        }

        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }


        const reqBody = await req.json()


        if (!mongoose.Types.ObjectId.isValid(context.params.landfillId)) return NextResponse.json({ success: false, message: "Landfill not exists" }, { status: 400 })

        const updateLandfill = await Landfill.findOneAndUpdate({ _id: context.params.landfillId }, reqBody, { returnDocument: "after" })

        if (!updateLandfill) return NextResponse.json({ success: false, message: "Landfill not exists" }, { status: 400 })


        return NextResponse.json({
            success: true,
            message: "Landfill update successfully",
            data: updateLandfill
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

export async function DELETE(req, context) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }


        if (!mongoose.Types.ObjectId.isValid(context.params.landfillId)) return NextResponse.json({ success: false, message: "Landfill not exists" }, { status: 400 })

        const landfill = await Landfill.findByIdAndDelete({ _id: context.params.landfillId })

        if (!landfill) return NextResponse.json({ success: false, message: "Landfill not exists" }, { status: 400 })

        return NextResponse.json({
            success: true,
            message: `Successfully deleted Landfill ${context.params.landfillId}`
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}