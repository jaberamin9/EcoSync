import { connect } from "@/dbConnection/dbConnection";
import { getDataFromToken } from "@/utils/getDataFromToken";
import User from "@/models/user";

connect()

export const rolePermissionCheck = async (req) => {
    try {
        const logedInUser = await getDataFromToken(req);
        console.log(logedInUser.permission.permissions)
        if (logedInUser.role === "STS Manager") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }
    } catch (error) {
        throw new Error(error.message);
    }
}