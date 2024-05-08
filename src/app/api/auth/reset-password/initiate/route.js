import { connect } from "@/dbConnection/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { sendEmail } from "@/utils/mailer";


connect()


export async function POST(req) {

    try {
        const reqBody = await req.json()
        const { email } = reqBody

        if (!email) {
            return NextResponse.json({ success: false, message: "field are missing" }, { status: 400 })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not pound" }, { status: 400 })
        }

        //send code by email
        await sendEmail({ email, emailType: "RESET-OTP", userId: user._id })

        return NextResponse.json({
            success: true,
            message: "Code send successfully"
        }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}