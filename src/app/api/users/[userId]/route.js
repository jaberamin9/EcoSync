import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/utils/get-data-from-token";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
var mongoose = require('mongoose');

connect()


export async function GET(req, context) {
    try {
        if (!mongoose.Types.ObjectId.isValid(context.params.userId)) return NextResponse.json({ success: false, message: "User not exists" }, { status: 400 })

        let user = await User.findOne({ _id: context.params.userId })

        if (!user) return NextResponse.json({ success: false, message: "User not exists" }, { status: 400 })

        return NextResponse.json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles
            }
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

export async function PUT(req, context) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const reqBody = await req.json()

        if (!mongoose.Types.ObjectId.isValid(context.params.userId)) return NextResponse.json({ success: false, message: "User not exists" }, { status: 400 })

        const user = await User.findOneAndUpdate({ _id: context.params.userId }, reqBody, { returnDocument: "after" })

        if (!user) return NextResponse.json({ success: false, message: "User not exists" }, { status: 400 })

        return NextResponse.json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles
            }
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

        if (!mongoose.Types.ObjectId.isValid(context.params.userId)) return NextResponse.json({ success: false, message: "User not exists" }, { status: 400 })

        const user = await User.findByIdAndDelete({ _id: context.params.userId })

        if (!user) return NextResponse.json({ success: false, message: "User not exists" }, { status: 400 })

        return NextResponse.json({
            success: true,
            message: `Successfully deleted user ${context.params.userId}`
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}