import { getDataFromToken } from "@/utils/get-data-from-token";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { connect } from "@/dbConnection/dbConnection";

connect();

export async function GET(req) {
    try {
        const userId = await getDataFromToken(req);
        const logInUser = await User.findOne({ _id: userId.id }).select(["-password", "-otpSecretKey", "-__v"]);
        if (!logInUser) {
            return NextResponse.json({ success: false, error: "you are not log in" }, { status: 400 })
        }
        return NextResponse.json({
            success: true,
            data: logInUser
        })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

}

export async function PUT(req) {
    try {
        const reqBody = await req.json()

        const userId = await getDataFromToken(req);

        const logInUser = await User.findOneAndUpdate({ _id: userId.id }, reqBody, { returnDocument: "after" }).select(["-password", "-otpSecretKey", "-__v"])
        if (!logInUser) {
            return NextResponse.json({ success: false, error: "you are not log in" }, { status: 400 })
        }
        return NextResponse.json({
            success: true,
            data: logInUser
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

}