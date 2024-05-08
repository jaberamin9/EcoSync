import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/utils/get-data-from-token";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/utils/mailer";
import speakeasy from 'speakeasy';
import Sts from "@/models/sts";
import mongoose from "mongoose";
import Landfill from "@/models/landfill";

connect()


export async function GET(req) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const userType = String(req.nextUrl.searchParams)
        const { key, value } = extractKeyValue(userType);

        let searchBy = {}
        if (key) searchBy[key] = req.nextUrl.searchParams.get('role')

        const val = { _id: { $nin: req.nextUrl.searchParams.get('id') } }

        if (req.nextUrl.searchParams.get('landfill') === 'true') {
            const sts = await Landfill.find(val).select("_id")
                .populate({ path: 'manager', select: '_id', model: User });
            const userId = sts.map(item => item.manager.map(item => item._id.toString())).flat()
            searchBy['_id'] = { $nin: userId }
        } else {
            const sts = await Sts.find(val).select("_id")
                .populate({ path: 'manager', select: '_id', model: User });
            const userId = sts.map(item => item.manager.map(item => item._id.toString())).flat()
            searchBy['_id'] = { $nin: userId }
        }

        let users = await User.find(searchBy)

        users = users.map(({ _doc: { __v, password, otpSecretKey, forgotPasswordToken, forgotPasswordTokenExpiry, ...rest } }) => rest)
        return NextResponse.json({
            success: true,
            data: users
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const reqBody = await req.json()
        const { username, email, password } = reqBody

        if (!username || !email || !password) {
            return NextResponse.json({ success: false, message: "field are missing" }, { status: 400 })
        }

        //check if user already exists
        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 })
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        const otpSecretKey = speakeasy.generateSecret({ length: 20 });

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            otpSecretKey
        })

        const savedUser = await newUser.save()


        //send email (email & pass)
        await sendEmail({ email, emailType: "CREATE", userId: savedUser._id, password })

        return NextResponse.json({
            success: true,
            message: "Registration success: please ask the user to check their email"
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}


function extractKeyValue(str) {
    // Remove curly braces and split by '=>'
    const pairs = str.replace(/\+/g, ' ').split(/\s*=\s*/);
    // Extract key and value
    const key = pairs[0];
    const value = pairs[1];
    return { key, value };
}