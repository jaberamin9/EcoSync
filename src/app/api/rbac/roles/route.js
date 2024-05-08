import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/utils/get-data-from-token";
import Role from "@/models/role";
import { NextRequest, NextResponse } from "next/server";
import Permissions from "@/models/permissions";

connect()

export async function GET(req) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        let roles = await Role.find().select("-__v")
            .populate({ path: 'permissions', select: '_id permissionsName', model: Permissions }).exec();

        return NextResponse.json({
            success: true,
            data: roles
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
        const { role } = reqBody

        if (!role) {
            return NextResponse.json({ success: false, message: "field are missing" }, { status: 400 })
        }

        //check if role already exists
        const isRoleExists = await Role.findOne({ role })

        if (isRoleExists) {
            return NextResponse.json({ success: false, message: "This Role already exists" }, { status: 400 })
        }

        const newRole = new Role({
            role
        })

        await newRole.save()

        return NextResponse.json({
            success: true,
            message: "Role add successfully"
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

export async function PUT(req) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const reqBody = await req.json()
        const { role } = reqBody

        //check if role already exists
        const isRoleExists = await Role.findOne({ role })

        if (isRoleExists) {
            return NextResponse.json({ success: false, message: "This Role already exists" }, { status: 400 })
        }

        const newRole = new Role({
            role
        })

        await newRole.save()

        return NextResponse.json({
            success: true,
            message: "Role add successfully"
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

