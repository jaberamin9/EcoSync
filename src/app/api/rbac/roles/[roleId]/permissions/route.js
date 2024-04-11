import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/utils/getDataFromToken";
import Role from "@/models/role";
import { NextRequest, NextResponse } from "next/server";
var mongoose = require('mongoose');

connect()

export async function PUT(req, context) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const { permissions } = await req.json()

        if (!mongoose.Types.ObjectId.isValid(context.params.roleId)) return NextResponse.json({ success: false, error: "Role not exists" }, { status: 400 })

        const role = await Role.findOneAndUpdate({ _id: context.params.roleId }, { permissions })

        if (!role) return NextResponse.json({ success: false, error: "Role not exists" }, { status: 400 })

        const margeData = await Role.
            findOne({ _id: context.params.roleId }).
            populate('permissions');


        return NextResponse.json({
            success: true,
            message: `Successfully assigning permissions to a role`,
            data: margeData
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}