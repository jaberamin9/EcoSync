"use client"

import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { RbacOperationDialog } from "@/components/rbac-operation-dialog";
import { AssignPermissionsOperationDialog } from "@/components/assign-permission-operation-dialog";

async function getBill(id) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/wde/${id}/bill`, {
        method: 'GET'
    }).then(data => data.json())
}

function formatDate(dateVal) {
    var newDate = new Date(dateVal);
    var sMonth = padValue(newDate.getMonth() + 1);
    var sDay = padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours();
    var sMinute = padValue(newDate.getMinutes());
    var sAMPM = "AM";
    var iHourCheck = parseInt(sHour);
    if (iHourCheck > 12) {
        sAMPM = "PM";
        sHour = iHourCheck - 12;
    }
    else if (iHourCheck === 0) {
        sHour = "12";
    }
    sHour = padValue(sHour);
    const date = sMonth + "/" + sDay + "/" + sYear
    const time = sHour + ":" + sMinute + " " + sAMPM
    return [date, time];
}
function padValue(value) {
    return (value < 10) ? "0" + value : value;
}

export const columns = [
    {
        accessorKey: "roles",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("roles")}</div>
        },
    }, {
        accessorKey: "permissions",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Permissions
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            console.log(row)
            return <div className="text-center">{row.getValue("permissions") != "" ? row.getValue("permissions") : "Not assigned"}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const queryClient = useQueryClient();
            const { toast } = useToast()
            const [open, setOpen] = useState(false);
            const [openDialog, setOpenDialog] = useState(false);
            const [biiDialog, setBiiDialog] = useState(false);
            const landfill = row.original

            const [data, setData] = useState()
            const handleSubmit = async () => {
                const res = await getBill(landfill.id);
                if (res.success) {
                    setData(res.data)
                    setBiiDialog(true)
                }
            }

            const mutation = useMutation({
                mutationFn: async (id) => {
                    await fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/rbac/roles/${id}`, {
                        method: 'DELETE'
                    }).then(data => data.json())
                },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['rbac'] })
                    toast({ title: "RBAC deleted" })
                },
                onError: (err) => {
                    toast({ title: "RBAC not deleted" })
                },
            });


            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setOpenDialog(true)}>Assigning permissions</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpen(true)}>Update</DropdownMenuItem>
                            <DropdownMenuItem
                                className='text-red-400 hover:text-red-400 focus:text-red-400'
                                onClick={() => { mutation.mutate(landfill.id) }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <RbacOperationDialog open={open} setOpen={setOpen} data={landfill}></RbacOperationDialog>
                    <AssignPermissionsOperationDialog open={openDialog} setOpen={setOpenDialog} data={landfill}></AssignPermissionsOperationDialog>
                </>
            )
        },
    },
]
