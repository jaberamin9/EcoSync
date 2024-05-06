"use client"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"


async function updateUser(credentials) {
    return fetch(`/api/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}


async function getProfile() {
    return fetch(`/api/profile`, {
        method: 'GET'
    }).then(data => data.json())
}


export function ProfileDialog({ open, setOpen }) {
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [edit, setEdit] = useState(false)


    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        const res = await updateUser({ username: userName });

        if (res.success) {
            setError("")
            setLoading(false)
            setEdit(pre => !pre)
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
    }, [edit]);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{edit ? "Edit profile" : "Profile"}</DialogTitle>
                    {
                        edit ? <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription> : ""
                    }

                </DialogHeader>
                <div className="flex justify-end">
                    <div className="bg-red-300 text-white rounded-md px-1 cursor-pointer" onClick={() => setEdit(pre => !pre)}>{!edit ? 'edit' : 'cancel'}</div>
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
                            onChange={e => edit ? setUserName(e.target.value) : ""}
                            className="col-span-3"
                        />
                    </div>
                    {!edit ? <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="username"
                            value={email}
                            defaultValue="@peduarte"
                            onChange={e => edit ? setEmail(e.target.value) : ""}
                            className="col-span-3"
                        />
                    </div> : ""}

                    {!edit ? <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Role
                        </Label>
                        <Input
                            id="username"
                            value={role}
                            defaultValue="@peduarte"
                            onChange={e => edit ? setRole(e.target.value) : ""}
                            className="col-span-3"
                        />
                    </div> : ""}
                </div>
                {
                    edit ? <DialogFooter>
                        <Button variant="custom" onClick={handleSubmit} disabled={loading}>
                            Save changess
                            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                        </Button>
                    </DialogFooter> : ""
                }

            </DialogContent>
        </Dialog >
    )
}
