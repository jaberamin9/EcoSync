import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/utils/getDataFromToken";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
var mongoose = require('mongoose');

connect()

export async function PUT(req, context) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const reqBody = await req.json()

        if (!mongoose.Types.ObjectId.isValid(context.params.userId)) return NextResponse.json({ success: false, error: "User not exists" }, { status: 400 })

        const user = await User.findOneAndUpdate({ _id: context.params.userId }, reqBody)

        if (!user) return NextResponse.json({ success: false, error: "User not exists" }, { status: 400 })

        return NextResponse.json({
            success: true,
            message: `Successfully updating a user id (${context.params.userId}) role from ${user.roles} to ${reqBody.roles}`

        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}