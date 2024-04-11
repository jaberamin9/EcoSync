
import { connect } from "@/dbConnection/dbConnection";
import Wce from "@/models/wce";
import { NextRequest, NextResponse } from "next/server";
var mongoose = require('mongoose');
import { getDataFromToken } from "@/utils/getDataFromToken";
import Sts from "@/models/sts";
import Vehicle from "@/models/vehicle";
import Landfill from "@/models/landfill";

connect()

export async function PUT(req, context) {
    try {
        const logedInUser = await getDataFromToken(req);
        //only access System Admin and STS Manager

        if (logedInUser.role === "Landfill Manager") {
            const reqBody = await req.json()
            const { running } = reqBody

            if (!mongoose.Types.ObjectId.isValid(context.params.wceId)) return NextResponse.json({ success: false, error: "WCE not exists" }, { status: 400 })

            const updateWce = await Wce.findOneAndUpdate({ _id: context.params.wceId }, { running }, { returnDocument: "after" })

            if (!updateWce) return NextResponse.json({ success: false, error: "WCE not exists" }, { status: 400 })

            return NextResponse.json({
                success: true,
                message: "WCE running field update successfully",
                data: updateWce
            }, { status: 200 })
        }

        const reqBody = await req.json()

        if (!mongoose.Types.ObjectId.isValid(context.params.wceId)) return NextResponse.json({ success: false, error: "WCE not exists" }, { status: 400 })

        const updateWce = await Wce.findOneAndUpdate({ _id: context.params.wceId }, reqBody, { returnDocument: "after" })

        if (!updateWce) return NextResponse.json({ success: false, error: "WCE not exists" }, { status: 400 })

        // const margeData = await Wce.
        //     findOne({ _id: updateWce._id }).select('-__v')
        //     .populate({ path: 'stsId', select: '-__v', model: Sts }).populate({ path: 'vehicleId', select: '-__v', model: Vehicle })
        //     .populate({ path: 'landfillId', select: '-__v', model: Landfill });

        return NextResponse.json({
            success: true,
            message: "WCE update successfully",
            data: updateWce
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function DELETE(req, context) {
    try {
        const logedInUser = await getDataFromToken(req);
        //only access System Admin and STS Manager
        if (logedInUser.role === "Landfill Manager") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }


        if (!mongoose.Types.ObjectId.isValid(context.params.wceId)) return NextResponse.json({ success: false, error: "WCE not exists" }, { status: 400 })

        const wce = await Wce.findByIdAndDelete({ _id: context.params.wceId })

        if (!wce) return NextResponse.json({ success: false, error: "WCE not exists" }, { status: 400 })

        return NextResponse.json({
            success: true,
            message: `Successfully deleted WCE ${context.params.wceId}`
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}