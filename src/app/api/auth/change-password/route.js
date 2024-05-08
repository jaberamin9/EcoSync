import { NextResponse } from "next/server";
import { connect } from "@/dbConnection/dbConnection";
import User from "@/models/user";
import bcryptjs from "bcryptjs";
import { getDataFromToken } from "@/utils/get-data-from-token";


connect()

export async function PUT(req) {
    try {
        const reqBody = await req.json()
        const { oldPassword, newPassword } = reqBody;

        if (!oldPassword || !newPassword) {
            return NextResponse.json({ success: false, message: "field are missing" }, { status: 400 })
        }

        const logedInUser = await getDataFromToken(req);
        const email = logedInUser.email

        //check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ success: false, message: "User does not exist" }, { status: 400 })
        }

        //check if password is correct
        const validPassword = await bcryptjs.compare(oldPassword, user.password)
        if (!validPassword) {
            return NextResponse.json({ success: false, message: "Password not match" }, { status: 400 })
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(newPassword, salt)

        await User.findOneAndUpdate({ email }, {
            password: hashedPassword
        })


        return NextResponse.json({
            success: true,
            message: "Password update success"
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

}
