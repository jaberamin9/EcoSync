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
import { PermissionsOperationDialog } from "@/components/permission-operation-dialog";


async function getBill(id) {
    return fetch(`/api/wde/${id}/bill`, {
        method: 'GET'
    }).then(data => data.json())
}



export const columns = [
    {
        accessorKey: "permissionsName",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Permissions Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("permissionsName")}</div>
        },
    }, {
        accessorKey: "permissionsValue",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Assigned Permissions
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("permissionsValue") != "" ? row.getValue("permissionsValue") : "Not assigned"}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const queryClient = useQueryClient();
            const { toast } = useToast()
            const [open, setOpen] = useState(false);
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
                    await fetch(`/api/rbac/permissions/${id}`, {
                        method: 'DELETE'
                    }).then(data => data.json())
                },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['permissions'] })
                    toast({ title: "Permissions deleted" })
                },
                onError: (err) => {
                    toast({ title: "Permissions not deleted" })
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

                            <DropdownMenuItem onClick={() => setOpen(true)}>Update</DropdownMenuItem>
                            <DropdownMenuItem
                                className='text-red-400 hover:text-red-400 focus:text-red-400'
                                onClick={() => { mutation.mutate(landfill.id) }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <PermissionsOperationDialog open={open} setOpen={setOpen} data={landfill}></PermissionsOperationDialog>
                </>
            )
        },
    },
]
