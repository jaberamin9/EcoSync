import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/utils/get-data-from-token";
import Permissions from "@/models/permissions";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

connect()


export async function PUT(req, context) {
    try {

        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const reqBody = await req.json()

        //check if role already exists
        const isPermissionsExists = await Permissions.findOne({ _id: context.params.permissionsId })

        if (!isPermissionsExists) {
            return NextResponse.json({ success: false, error: "Not exists" }, { status: 400 })
        }

        const updatePermissions = await Permissions.findOneAndUpdate({ _id: context.params.permissionsId }, reqBody, { returnDocument: "after" }).select("-__v")

        return NextResponse.json({
            success: true,
            message: "Permissions successfully update",
            data: updatePermissions
        }, { status: 201 })
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

        if (!mongoose.Types.ObjectId.isValid(context.params.permissionsId)) return NextResponse.json({ success: false, error: "Permission not exists" }, { status: 400 })

        const permissions = await Permissions.findByIdAndDelete({ _id: context.params.permissionsId })

        if (!permissions) return NextResponse.json({ success: false, error: "Permission not exists" }, { status: 400 })

        return NextResponse.json({
            success: true,
            message: `Successfully deleted permission ${context.params.permissionsId}`
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

