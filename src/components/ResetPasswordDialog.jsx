"use client"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Icon } from "@iconify/react"



async function resetPassword(credentials) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}



export function ResetPasswordDialog({ open, setOpen }) {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const res = await resetPassword({ oldPassword, newPassword });
        if (res.success) {
            setError(res.message)
            setLoading(false)
        } else {
            setError(res.error)
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[200px] ">
                <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="oldPassword" className="text-right">Old Password</Label>
                        <Input
                            id="name"
                            defaultValue="Pedro Duarte"
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newPassword" className="text-right">New Password</Label>
                        <Input
                            id="name"
                            defaultValue="Pedro Duarte"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    {error != "" ? <p className="text-[11px] bg-red-100 p-1 rounded-md mx-2 text-center">{error}</p> : ""}

                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={loading}>
                        Reset Password
                        {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                    </Button>
                </DialogFooter>


            </DialogContent>
        </Dialog >
    )
}
