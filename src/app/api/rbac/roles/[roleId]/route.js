import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/utils/getDataFromToken";
import Role from "@/models/role";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function PUT(req, context) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const reqBody = await req.json()

        //check if role already exists
        const isRoleExists = await Role.findOne({ _id: context.params.roleId })

        if (!isRoleExists) {
            return NextResponse.json({ success: false, error: "Not exists" }, { status: 400 })
        }

        const updateRole = await Role.findOneAndUpdate({ _id: context.params.roleId }, reqBody, { returnDocument: "after" }).select("-__v")

        return NextResponse.json({
            success: true,
            message: "Role successfully update",
            data: updateRole
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

        if (!mongoose.Types.ObjectId.isValid(context.params.roleId)) return NextResponse.json({ success: false, error: "Role not exists" }, { status: 400 })

        const role = await Role.findByIdAndDelete({ _id: context.params.roleId })

        if (!role) return NextResponse.json({ success: false, error: "Role not exists" }, { status: 400 })

        return NextResponse.json({
            success: true,
            message: `Successfully deleted role ${context.params.roleId}`
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

