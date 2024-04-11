import { connect } from "@/dbConnection/dbConnection";
import Wde from "@/models/wde";
import { NextRequest, NextResponse } from "next/server";
var mongoose = require('mongoose');
import { getDataFromToken } from "@/utils/getDataFromToken";
import Landfill from "@/models/landfill";
import Sts from "@/models/sts";
import Vehicle from "@/models/vehicle";


connect()

export async function PUT(req, context) {
    try {
        const logedInUser = await getDataFromToken(req);
        //only access System Admin and Landfill Manager
        if (logedInUser.role === "STS Manager") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }


        const reqBody = await req.json()

        if (!mongoose.Types.ObjectId.isValid(context.params.wdeId)) return NextResponse.json({ success: false, error: "WDE not exists" }, { status: 400 })

        const updateWde = await Wde.findOneAndUpdate({ _id: context.params.wdeId }, reqBody, { returnDocument: "after" })

        if (!updateWde) return NextResponse.json({ success: false, error: "WDE not exists" }, { status: 400 })

        // const margeData = await Wde.
        //     findOne({ _id: updateWde._id }).select('-__v')
        //     .populate({ path: 'stsId', select: '-__v', model: Sts }).populate({ path: 'vehicleId', select: '-__v', model: Vehicle }).populate({ path: 'landfillId', select: '-__v', model: Landfill });

        return NextResponse.json({
            success: true,
            message: "WDE update successfully",
            data: updateWde
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function DELETE(req, context) {
    try {
        const logedInUser = await getDataFromToken(req);
        //only access System Admin and Landfill Manager
        if (logedInUser.role === "STS Manager") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }



        if (!mongoose.Types.ObjectId.isValid(context.params.wdeId)) return NextResponse.json({ success: false, error: "WDE not exists" }, { status: 400 })

        const wde = await Wde.findByIdAndDelete({ _id: context.params.wdeId })

        if (!wde) return NextResponse.json({ success: false, error: "WDE not exists" }, { status: 400 })

        return NextResponse.json({
            success: true,
            message: `Successfully deleted WDE ${context.params.wdeId}`
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}