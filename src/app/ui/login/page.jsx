"use client"
import { useState } from "react";
import Image from 'next/image'
import pic from '../../../../public/medium.png'

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
import Link from 'next/link';


async function loginUser(credentials) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/auth/login`, {
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

    const handleSubmit = async () => {
        setLoading(true)

        const token = await loginUser({
            email,
            password
        });
        if (token.success) {
            setLoading(false)
            localStorage.setItem('role', token.role);
            localStorage.setItem('name', token.name);
            router.replace("/ui/dashboard");
        } else {
            setError(token.error)
            setLoading(false)
        }
    }

    return (
        <div className=" h-screen bg-gray-200 flex justify-center items-center">
            <div className=" w-[50%] h-[50%] rounded-lg flex flex-wrap bg-gray-100 overflow-hidden shadow-lg">
                <div className="flex-1">
                    <div className="w-full h-full rounded-lg overflow-hidden">
                        <Image className="w-full h-full object-cover" priority={true} src={pic} alt="" />
                    </div>
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <Card className=" bg-transparent border-transparent shadow-none">
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2 ">
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="email">Email</Label>
                                        <Input onChange={e => setEmail(e.target.value)} id="email" type="email" placeholder="Enter your email" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="password">Password</Label>
                                        <Input onChange={e => setPassword(e.target.value)} id="password" type="password" placeholder="Enter your password" />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        {error != "" ? <p className="text-[11px] bg-red-100 p-1 rounded-md mx-6 text-center">{error}</p> : ""}
                        <CardFooter className="pt-2 flex justify-between">
                            <Button onClick={handleSubmit} type="submit" disabled={loading}>
                                Login
                                {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                            </Button>
                            <Button variant="ghost" className="text-[11px]">
                                <Link href="/ui/reset-password">reset password?</Link>
                            </Button>

                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div >
    );
}