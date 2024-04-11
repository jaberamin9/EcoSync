"use client"
import { Copy, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react"


async function updateUser(credentials) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}


async function getProfile() {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/profile`, {
        method: 'GET'
    }).then(data => data.json())
}


export function ProfileDialog({ open, setOpen }) {
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [edite, setEdite] = useState(false)


    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        const res = await updateUser({ username: userName });

        if (res.success) {
            setError("")
            setLoading(false)
            setEdite(pre => !pre)
        } else {
            setError(res.error)
            setLoading(false)
        }
    }

    useEffect(() => {
        async function fetchData() {
            let res = await getProfile();
            if (res.success) {
                setUserName(res.data.username)
                setEmail(res.data.email)
                setRole(res.data.role)
            }
        }
        fetchData()
    }, [edite]);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{edite ? "Edit profile" : "Profile"}</DialogTitle>
                    {
                        edite ? <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription> : ""
                    }

                </DialogHeader>
                <div className="flex justify-end">
                    <Icon onClick={() => setEdite(pre => !pre)} icon="fluent:pen-24-regular" width="24" height="24" />
                </div>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input
                            id="name"
                            defaultValue="Pedro Duarte"
                            value={userName}
                            onChange={e => edite ? setUserName(e.target.value) : ""}
                            className="col-span-3"
                        />
                    </div>
                    {!edite ? <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="username"
                            value={email}
                            defaultValue="@peduarte"
                            onChange={e => edite ? setEmail(e.target.value) : ""}
                            className="col-span-3"
                        />
                    </div> : ""}

                    {!edite ? <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Role
                        </Label>
                        <Input
                            id="username"
                            value={role}
                            defaultValue="@peduarte"
                            onChange={e => edite ? setRole(e.target.value) : ""}
                            className="col-span-3"
                        />
                    </div> : ""}
                </div>
                {
                    edite ? <DialogFooter>
                        <Button onClick={handleSubmit} disabled={loading}>
                            Save changess
                            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                        </Button>
                    </DialogFooter> : ""
                }

            </DialogContent>
        </Dialog >
    )
}
