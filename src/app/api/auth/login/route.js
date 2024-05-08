import { connect } from "@/dbConnection/dbConnection";
import User from "@/models/user";
import Role from "@/models/role";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Permissions from "@/models/permissions";

connect()

export async function POST(req) {
    try {
        const reqBody = await req.json()
        const { email, password } = reqBody;

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "field are missing" }, { status: 400 })
        }

        const userCount = await User.countDocuments()
        if (userCount == 0) {
            const username = "admin"
            const email = "admin@gmail.com"
            const password = "admin"
            const role = "System Admin"
            //hash password
            const salt = await bcryptjs.genSalt(10)
            const hashedPassword = await bcryptjs.hash(password, salt)
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                role
            })
            const savedUser = await newUser.save()

            await Role.insertMany([new Role({ role: 'System Admin' }), new Role({ role: 'STS Manager' }), new Role({ role: 'Landfill Manager' }), new Role({ role: 'Unassigned' })])

            //create token
            const token = await jwt.sign({ id: savedUser._id, username, email, role }, process.env.TOKEN_SECRET, { expiresIn: "1d" })

            const response = NextResponse.json({
                success: true,
                message: "Login successful",
                token: token,
                role: role,
                name: username
            }, { status: 200 })
            response.cookies.set("token", token, {
                httpOnly: true,
            })
            return response;
        }

        //check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ success: false, message: "User does not exist" }, { status: 400 })
        }

        //check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if (!validPassword) {
            return NextResponse.json({ success: false, message: "Invalid password" }, { status: 400 })
        }

        if (user.role === "Unassigned") {
            return NextResponse.json({ success: false, message: "your role is not confirm by admin" }, { status: 400 })
        }

        const margeData = await Role.findOne({ role: user.role }).populate({ path: 'permissions', select: '-__v', model: Permissions });

        //create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            permission: margeData
        }
        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" })

        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            token: token,
            role: user.role,
            name: user.username
        }, { status: 200 })
        response.cookies.set("token", token, {
            httpOnly: true,
        })
        return response;
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}