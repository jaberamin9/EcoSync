import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/utils/getDataFromToken";
import Role from "@/models/role";
import { NextRequest, NextResponse } from "next/server";
import Permissions from "@/models/permissions";

connect()

export async function GET(req) {
    try {
        //import { getDataFromToken } from "@/utils/getDataFromToken";
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }


        let roles = await Role.find().select("-__v")
            .populate({ path: 'permissions', select: '_id permissionsName', model: Permissions }).exec();

        return NextResponse.json({
            success: true,
            roles: roles
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
// ["System Admin", "STS Manager", "Landfill Manager", "Unassigned"]
export async function POST(req) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const reqBody = await req.json()
        const { role } = reqBody

        //check if role already exists
        const isRoleExists = await Role.findOne({ role })

        if (isRoleExists) {
            return NextResponse.json({ success: false, error: "This Role already exists" }, { status: 400 })
        }

        const newRole = new Role({
            role
        })

        const savedUser = await newRole.save()

        return NextResponse.json({
            success: true,
            message: "Role add successfully"
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function PUT(req) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const reqBody = await req.json()
        const { role } = reqBody

        //check if role already exists
        const isRoleExists = await Role.findOne({ role })

        if (isRoleExists) {
            return NextResponse.json({ success: false, error: "This Role already exists" }, { status: 400 })
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
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

