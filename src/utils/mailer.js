import nodemailer from 'nodemailer';
import User from "@/models/user";
import speakeasy from 'speakeasy';


export const sendEmail = async ({ email, emailType, userId, password = "" }) => {
    try {
        // create otp
        let code
        if (emailType === "RESET-OTP") {
            const otpSecretKey = speakeasy.generateSecret({ length: 20 });
            const secret = await User.findByIdAndUpdate(userId, {
                otpSecretKey
            }, { returnDocument: "after" })

            code = speakeasy.totp({
                secret: secret.otpSecretKey.base32,
                encoding: 'base32',
            });
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "011c380634f600",
                pass: "761517b84860b4"
            }
        });

        const mailOptions = {
            from: 'jaberamin9@gmail.com',
            to: email,
            subject: emailType === "CREATE" ? "Registration success" : "Reset your password",
            html: emailType === "CREATE" ? `<p>email: ${email}</br>password: ${password}</p>` : `<p>your otp is: ${code}</p>`
        }
        const mailresponse = await transport.sendMail(mailOptions);
        return mailresponse;

    } catch (error) {
        throw new Error(error.message);
    }
}