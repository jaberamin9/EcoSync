import { connect } from "@/dbConnection/dbConnection";
import Role from "@/models/role";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function GET() {
    try {
        let roles = await Role.find()
        roles = roles.map(({ _doc: { __v, ...rest } }) => rest)
        return NextResponse.json({
            success: true,
            data: roles
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
