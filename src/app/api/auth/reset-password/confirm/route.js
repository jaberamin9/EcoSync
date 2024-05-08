import { NextResponse } from "next/server";
import { connect } from "@/dbConnection/dbConnection";
import User from "@/models/user";
import speakeasy from 'speakeasy';
import { tokenGenerate } from "@/utils/token-generate";

connect()

export async function POST(req) {
    try {
        const reqBody = await req.json()
        const { email } = reqBody
        const { otp } = reqBody

        if (!email || !otp) {
            return NextResponse.json({ success: false, message: "field are missing" }, { status: 400 })
        }

        const user = await User.findOne({ email });

        const tokenValidates = speakeasy.totp.verify({
            secret: user.otpSecretKey.base32,
            encoding: 'base32',
            token: otp,
            window: 2
        });

        if (!tokenValidates) return NextResponse.json({ success: false, message: "otp not valid" }, { status: 400 })

        const resetToken = await tokenGenerate(user._id)

        const res = NextResponse.json({
            success: true,
            message: "otp ok",
            resetToken: resetToken.token
        }, { status: 200 })

        return res;
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

}
