import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/utils/get-data-from-token";
import Permissions from "@/models/permissions";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function GET(req) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        let permission = await Permissions.find()
        permission = permission.map(({ _doc: { __v, ...rest } }) => rest)
        return NextResponse.json({
            success: true,
            data: permission
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
        let { permissionsName, permissionsValue } = reqBody

        if (permissionsValue == null) permissionsValue = "read"

        //check if role already exists
        const isPermissionsExists = await Permissions.findOne({ permissionsName })

        if (isPermissionsExists) {
            const updatePermissions = await Permissions.findOneAndUpdate({ permissionsName }, { permissionsName, permissionsValue }, { returnDocument: "after" }).select("-__v")
            return NextResponse.json({
                success: true,
                message: "Permission add successfully",
                data: updatePermissions
            }, { status: 201 })
        }

        if (!permissionsName || !permissionsValue) {
            return NextResponse.json({ success: false, message: "field are missing" }, { status: 400 })
        }

        const newPermissions = new Permissions({
            permissionsName,
            permissionsValue
        })

        await newPermissions.save()

        return NextResponse.json({
            success: true,
            message: "Permission add successfully"
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

export async function DELETE(req) {
    try {
        const logedInUser = await getDataFromToken(req);
        if (logedInUser.role != "System Admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const reqBody = await req.json()
        let { permissionsName, remove } = reqBody
        if (remove) {
            const isPermissionsExists = await Permissions.findOneAndDelete({ permissionsName })

            if (!isPermissionsExists) return NextResponse.json({ success: false, message: "Permission not exists" }, { status: 400 })

            return NextResponse.json({
                success: true,
                message: `Successfully deleted ${permissionsName} permission`
            }, { status: 200 })
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

