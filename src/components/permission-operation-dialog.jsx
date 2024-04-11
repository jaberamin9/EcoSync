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
import MultiSelectDropdown2 from "./MultiSelectDropdown2"



async function updatePermissions(credentials, id) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/rbac/permissions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}


async function addePermissions(credentials) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/rbac/permissions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}


export function PermissionsOperationDialog({ open, setOpen, data, add = false }) {
    const [permissionsName, setPermissionsName] = useState(add ? "" : (data) ? data.permissionsName : "")
    const [permissionSelectedList, setPermissionSelectedList] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const queryClient = useQueryClient();

    const permisionList = ["read", "write", "update", "delete"]


    const handleSubmit = async () => {
        setLoading(true)

        let res
        if (add) {
            res = await addePermissions({
                permissionsName,
                permissionsValue: permissionSelectedList
            });
        } else {
            res = await updatePermissions({
                permissionsName,
                permissionsValue: permissionSelectedList
            }, data.id);
        }

        if (res.success) {
            setError("")
            setLoading(false)
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['permissions'] })
        } else {
            setError(res.error)
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md w-auto">
                <DialogHeader>
                    <DialogTitle>{add ? "Create permission" : "Update permission"}</DialogTitle>
                    <DialogDescription>
                        Insert your permission
                    </DialogDescription>
                </DialogHeader>


                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Permission name</Label>
                    <Input onChange={e => setPermissionsName(e.target.value)} value={permissionsName} className="w-[300px] h-9" type="rext" placeholder="Permission name" />
                </div>
                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Select Permission</Label>
                    <MultiSelectDropdown2
                        formFieldName={"permissions"}
                        options={permisionList}
                        onChange={val => { setPermissionSelectedList(val) }}>
                    </MultiSelectDropdown2>
                </div>
                {error != "" ? <p className="text-[11px] w-[300px] bg-red-100 p-1 rounded-md text-center">{error}</p> : ""}

                <DialogFooter className="sm:justify-end">
                    <Button onClick={handleSubmit} type="submit" variant="secondary" disabled={loading}>
                        {add ? "Create" : "Update"}
                        {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
