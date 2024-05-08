import { connect } from "@/dbConnection/dbConnection";
import Sts from "@/models/sts";
import { NextRequest, NextResponse } from "next/server";
var mongoose = require('mongoose');
import { getDataFromToken } from "@/utils/get-data-from-token";

connect()

export async function PUT(req, context) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const reqBody = await req.json()

        if (!mongoose.Types.ObjectId.isValid(context.params.stsId)) return NextResponse.json({ success: false, message: "STS not exists" }, { status: 400 })

        const updateSts = await Sts.findOneAndUpdate({ _id: context.params.stsId }, reqBody, { returnDocument: "after" })

        if (!updateSts) return NextResponse.json({ success: false, message: "STS not exists" }, { status: 400 })

        return NextResponse.json({
            success: true,
            message: "STS update successfully",
            data: updateSts
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

        if (!mongoose.Types.ObjectId.isValid(context.params.stsId)) return NextResponse.json({ success: false, message: "STS not exists" }, { status: 400 })

        const sts = await Sts.findByIdAndDelete({ _id: context.params.stsId })

        if (!sts) return NextResponse.json({ success: false, message: "STS not exists" }, { status: 400 })

        return NextResponse.json({
            success: true,
            message: `Successfully deleted STS ${context.params.stsId}`
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}