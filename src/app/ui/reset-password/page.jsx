"use client"
import { useState } from "react";
import Image from 'next/image'
import findEmailImg from '../../../../public/findemail.png'
import otpImg from '../../../../public/otpimage.png'
import newPasswordImg from '../../../../public/newpasswordimg.png'

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import Link from "next/link";


async function confirmOtp(credentials) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/auth/reset-password/confirm`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}
async function sendOtp(credentials) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/auth/reset-password/initiate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}
async function resetPassword(credentials) {
    console.log(credentials)
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/auth/reset-password/reset`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}
export default function Home() {
    const router = useRouter();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [otpView, setOtpView] = useState(0)
    const [otpCode, setOtpCode] = useState(false)
    const [resetToken, setResetToken] = useState("")

    const handleSubmit = async e => {
        setLoading(true)
        e.preventDefault();

        if (otpView == 2) {
            const res = await resetPassword({
                password,
                resetToken
            });
            if (res.success) {
                router.replace("/ui/login");
            } else {
                setError(res.error)
            }
            console.log(email, password, resetToken)
        } else if (otpView == 1) {
            const res = await confirmOtp({
                email,
                otp: otpCode
            });
            if (res.success) {
                setOtpView(2)
                setError("")
                setResetToken(res.resetToken)
            } else {
                setError(res.error)
            }
        } else {
            const res = await sendOtp({
                email
            });
            if (res.success) {
                setOtpView(1)
                setError("")
            } else {
                setError(res.error)
            }
        }

        setLoading(false)
    }


    const onComplete = (value) => {
        setOtpCode(value)
    }


    if (otpView == 0) {
        return (
            <div className="h-screen bg-gray-200 flex justify-center items-center">
                <div className=" w-[50%] h-[50%] rounded-lg flex flex-wrap bg-gray-100 overflow-hidden shadow-lg">
                    <div className="flex-1">
                        <div className="w-full h-full rounded-lg overflow-hidden">
                            <Image className="w-full h-full object-cover" priority={true} src={findEmailImg} alt="" />
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center items-center">
                        <Card className=" bg-transparent border-transparent shadow-none">
                            <CardHeader>
                                <CardTitle>Reset Password</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2 ">
                                <form>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="email">Email</Label>
                                            <Input onChange={e => setEmail(e.target.value)} id="email" type="email" placeholder="Enter your email" />
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                            {error != "" ? <p className="text-[11px] bg-red-100 p-1 rounded-md mx-6 text-center">{error}</p> : ""}
                            <CardFooter className="pt-2 flex justify-between">
                                <Button onClick={handleSubmit} type="submit" disabled={loading}>
                                    Send Code
                                    {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                                </Button>
                                {/* <Button variant="ghost" className="text-[11px]">reset password?
                                <Link href={""}></Link>
                            </Button> */}
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div >
        );
    } else if (otpView == 1) {
        return (
            <div className="h-screen bg-gray-200 flex justify-center items-center">
                <div className=" w-[50%] h-[50%] rounded-lg flex flex-wrap bg-gray-100 overflow-hidden shadow-lg">
                    <div className="flex-1">
                        <div className="w-full h-full rounded-lg overflow-hidden">
                            <Image className="w-full h-full object-cover" priority={true} src={otpImg} alt="" />
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center items-center">
                        <Card className=" bg-transparent border-transparent shadow-none">
                            <CardHeader>
                                <CardTitle>OTP</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <InputOTP maxLength={6} onComplete={onComplete}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </CardContent>
                            {error != "" ? <p className="text-[11px] bg-red-100 p-1 rounded-md mx-6 text-center">{error}</p> : ""}
                            <CardFooter className="pt-2 flex justify-between">
                                <Button onClick={handleSubmit} type="submit" disabled={loading}>
                                    Verify
                                    {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                                </Button>
                                {/* <Button variant="ghost" className="text-[11px]">reset password?
                                <Link href={""}></Link>
                            </Button> */}
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div >
        )
    } else {
        return (
            <div className="h-screen bg-gray-200 flex justify-center items-center">
                <div className=" w-[50%] h-[50%] rounded-lg flex flex-wrap bg-gray-100 overflow-hidden shadow-lg">
                    <div className="flex-1">
                        <div className="w-full h-full rounded-lg overflow-hidden">
                            <Image className="w-full h-full object-cover" priority={true} src={newPasswordImg} alt="" />
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center items-center">
                        <Card className=" bg-transparent border-transparent shadow-none">
                            <CardHeader>
                                <CardTitle>Enter New Password</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2 ">
                                <form>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="password">New Password</Label>
                                            <Input onChange={e => setPassword(e.target.value)} id="password" type="password" placeholder="Enter your password" />
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                            {error != "" ? <p className="text-[11px] bg-red-100 p-1 rounded-md mx-6 text-center">{error}</p> : ""}
                            <CardFooter className="pt-2 flex justify-between">
                                <Button onClick={handleSubmit} type="submit" disabled={loading}>
                                    Reset Password
                                    {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                                </Button>
                                {/* <Button variant="ghost" className="text-[11px]">reset password?
                                <Link href={""}></Link>
                            </Button> */}
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div >
        );
    }
}