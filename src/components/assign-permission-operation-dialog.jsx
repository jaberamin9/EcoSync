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
import MultiSelectDropdown from "./MultiSelectDropdown"
import MultiSelectDropdown3 from "./MultiSelectDropdown3"



async function updateAssignPermissions(credentials, id) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/rbac/roles/${id}/permissions`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}


async function getPermissions() {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/rbac/permissions`, {
        method: 'GET'
    }).then(data => data.json())
}




export function AssignPermissionsOperationDialog({ open, setOpen, data, add = false }) {
    const [permissionSelectedList, setPermissionSelectedList] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


    const [loadings, setLoadings] = useState(true);
    const [stsList, setStsList] = useState([])

    const queryClient = useQueryClient();


    const handleSubmit = async () => {
        setLoading(true)

        const res = await updateAssignPermissions({
            permissions: permissionSelectedList
        }, data.id);


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

    useEffect(() => {
        async function fetchData() {
            let res = await getPermissions();
            if (res.success) {
                const newData = res.permission.map(item => {
                    return {
                        id: item._id,
                        value: item.permissionsName,
                    }
                })
                setStsList(newData)
                setLoadings(false)
            }
        }
        fetchData()
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md w-auto">
                <DialogHeader>
                    <DialogTitle>{"Assign permission"}</DialogTitle>
                </DialogHeader>

                <div className="grid w-[300px] max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Select Permission</Label>
                    <MultiSelectDropdown3
                        formFieldName={"assignpermissions"}
                        options={stsList}
                        onChange={val => { setPermissionSelectedList(val) }}>
                    </MultiSelectDropdown3>
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