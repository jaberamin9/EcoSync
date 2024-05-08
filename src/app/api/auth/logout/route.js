import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = NextResponse.json({
            success: true,
            message: "Logout successful"
        }, { status: 200 })

        res.cookies.set("token", "", {
            httpOnly: true, expires: new Date(0)
        });

        return res;
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

}
