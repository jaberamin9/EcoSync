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
    return fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

export default function Home() {
    const router = useRouter();
    const [inputField, setInputField] = useState({ email: '', password: '' })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const onChange = (e) => {
        setInputField({ ...inputField, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        setLoading(true)

        const token = await loginUser({
            email: inputField.email,
            password: inputField.password
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
            <div className="px-4 m-4 md:px-0 md:m-0 md:w-[50%] md:h-[50%] rounded-lg flex flex-wrap bg-gray-100 overflow-hidden shadow-lg">
                <div className="flex-1 hidden md:block md:w-[300px] md:h-auto">
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
                                <div className="grid w-full lg:w-[260px] items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="email">Email</Label>
                                        <Input onChange={e => onChange(e)} name="email" id="email" type="email" placeholder="Enter your email" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="password">Password</Label>
                                        <Input onChange={e => onChange(e)} name="password" id="password" type="password" placeholder="Enter your password" />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        {error != "" ? <p className="text-[11px] bg-red-100 p-1 rounded-md mx-6 text-center">{error}</p> : ""}
                        <CardFooter className="pt-2 flex justify-between">
                            <Button className='flex-1' variant="custom" onClick={handleSubmit} type="submit" disabled={loading}>
                                Login
                                {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                            </Button>
                            <Button className='flex-1 text-[11px]' variant="ghost">
                                <Link href="/ui/reset-password">reset password?</Link>
                            </Button>

                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div >
    );
}