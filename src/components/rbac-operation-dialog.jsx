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
    return fetch(`/api/rbac/roles/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function addeUser(credentials) {
    return fetch(`/api/rbac/roles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}


export function RbacOperationDialog({ open, setOpen, data, add = false }) {
    const [role, setRole] = useState(add ? "" : (data) ? data.roles : "")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        setLoading(true)
        let res
        if (add) {
            res = await addeUser({
                role
            });
        } else {
            res = await updateUser({
                role
            }, data.id);
        }

        if (res.success) {
            setError("")
            setLoading(false)
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['rbac'] })
        } else {
            setError(res.error)
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md w-auto">
                <DialogHeader>
                    <DialogTitle>{add ? "Create role" : "Update role"}</DialogTitle>
                </DialogHeader>


                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Role name</Label>
                    <Input onChange={e => setRole(e.target.value)} value={role} className="w-[300px] h-9" type="rext" placeholder="Role name" />
                </div>

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
