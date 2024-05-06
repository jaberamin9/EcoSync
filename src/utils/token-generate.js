import User from "@/models/user";
import bcryptjs from 'bcryptjs';

export const tokenGenerate = async (userId) => {
    try {
        let hashedToken = await bcryptjs.hash(userId.toString(), 10)
        const secret = await User.findByIdAndUpdate(userId, {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: Date.now() + 3600000,
        }, { returnDocument: "after" })

        return { isToken: true, token: hashedToken }
    } catch (error) {
        throw new Error(error.message);
    }
}