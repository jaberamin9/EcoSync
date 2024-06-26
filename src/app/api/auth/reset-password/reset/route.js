import { NextResponse } from "next/server";
import { connect } from "@/dbConnection/dbConnection";
import User from "@/models/user";
import bcryptjs from "bcryptjs";

connect()

export async function POST(req) {
    try {
        const reqBody = await req.json()
        const { password } = reqBody
        const { resetToken } = reqBody

        if (!resetToken || !password) {
            return NextResponse.json({ success: false, message: "field are missing" }, { status: 400 })
        }

        const user = await User.findOne({ forgotPasswordToken: resetToken, forgotPasswordTokenExpiry: { $gt: Date.now() } });

        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 400 })
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({
            message: "Password change successfully",
            success: true
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

}
