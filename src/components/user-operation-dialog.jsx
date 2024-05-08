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
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query";


async function updateUser(credentials, id) {
    return fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function addeUser(credentials) {
    return fetch(`/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}


export function UserOperationDialog({ open, setOpen, data, add = false }) {
    const [username, setUsername] = useState(add ? "" : (data) ? data.username : "")
    const [email, setEmail] = useState(add ? "" : (data) ? data.email : "")
    const [password, setPassword] = useState(add ? "" : (data) ? data.password : "")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        setLoading(true)
        let res
        if (add) {
            res = await addeUser({
                username,
                email,
                password
            });
        } else {
            res = await updateUser({
                username,
                email
            }, data.id);
        }

        if (res.success) {
            setError("")
            setLoading(false)
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['users'] })
        } else {
            setError(res.message)
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md w-auto">
                <DialogHeader>
                    <DialogTitle>{add ? "Create New User" : "Update existing user"}</DialogTitle>
                </DialogHeader>

                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Username</Label>
                    <Input onChange={e => setUsername(e.target.value)} value={username} className="w-[300px] h-9" type="text" placeholder="Username" />
                </div>
                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Email</Label>
                    <Input onChange={e => setEmail(e.target.value)} value={email} className="w-[300px] h-9" type="email" placeholder="Email" />
                </div>

                {add ?
                    <div className="grid w-auto max-w-sm items-center gap-1.5">
                        <Label htmlFor="disposed">Password</Label>
                        <Input onChange={e => setPassword(e.target.value)} value={password} className="w-[300px] h-9" type="P\password" placeholder="Password" />
                    </div>
                    : ""
                }

                {error != "" ? <p className="text-[11px] w-[300px] bg-red-100 p-1 rounded-md text-center">{error}</p> : ""}

                <DialogFooter className="sm:justify-end">
                    <Button onClick={handleSubmit} type="submit" className='w-full' variant="custom" disabled={loading}>
                        {add ? "Create" : "Update"}
                        {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
