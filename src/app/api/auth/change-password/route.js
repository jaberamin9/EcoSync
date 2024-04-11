import { NextResponse } from "next/server";
import { connect } from "@/dbConnection/dbConnection";
import User from "@/models/user";
import bcryptjs from "bcryptjs";

connect()

export async function PUT(req) {
    try {
        const reqBody = await req.json()
        const { email, oldPassword, newPassword } = reqBody;

        //check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ success: false, error: "User does not exist" }, { status: 400 })
        }

        //check if password is correct
        const validPassword = await bcryptjs.compare(oldPassword, user.password)
        if (!validPassword) {
            return NextResponse.json({ success: false, error: "Password not match" }, { status: 400 })
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(newPassword, salt)

        const savePassword = await User.findOneAndUpdate({ email }, {
            password: hashedPassword
        })


        return NextResponse.json({
            success: true,
            message: "Password update success"
        }, { status: 200 })

        return res;
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

}
