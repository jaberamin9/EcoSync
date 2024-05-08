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
import { UserOperationDialog } from "@/components/user-operation-dialog";
import { Checkbox } from "@/components/ui/checkbox"



export const columns = [
    {
        id: "select",
        cell: ({ row, table }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                    table.resetRowSelection()
                    row.toggleSelected(!!value)
                }}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "username",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Username
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("username")}</div>
        },
    }, {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("email")}</div>
        },
    }, {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <div
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Assigned Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("role") != "" ? row.getValue("role") : "Not assigned"}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const queryClient = useQueryClient();
            const { toast } = useToast()
            const [open, setOpen] = useState(false);
            const users = row.original

            const mutation = useMutation({
                mutationFn: async (id) => {
                    await fetch(`/api/users/${id}`, {
                        method: 'DELETE'
                    }).then(data => data.json())
                },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['users'] })
                    table.resetRowSelection()
                    toast({ title: "User deleted" })
                },
                onError: (err) => {
                    toast({ title: "User not deleted" })
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
                                onClick={() => { mutation.mutate(users.id) }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {open ? <UserOperationDialog open={open} setOpen={setOpen} data={users}></UserOperationDialog>
                        : ""
                    }
                </>
            )
        },
    },
]
