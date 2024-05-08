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
import Map from "@/components/map";
import { StsOperationDialog } from "@/components/sts-operation-dialog";



export const columns = [
    {
        accessorKey: "wardNumber",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ward Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("wardNumber")}</div>
        },
    }, {
        accessorKey: "capacity",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Capacity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("capacity")}</div>
        },
    }, {
        accessorKey: "manager",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Assigned Manager
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("manager") != "" ? row.getValue("manager") : "Not assigned"}</div>
        },
    }, {
        accessorKey: "location",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Location
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const [open, setOpen] = useState(false);
            return <>
                <div className="flex justify-center" onClick={() => setOpen(true)}>
                    <div className="cursor-pointer text-center bg-gray-200 text-black rounded-sm w-[100px] p-1">see on map</div>
                </div>
                {open ? <Map location={row.getValue("location")} open={open} setOpen={setOpen} popupText={row.original.wardNumber}></Map>
                    : ""
                }
            </>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const queryClient = useQueryClient();
            const { toast } = useToast()
            const [open, setOpen] = useState(false);
            const data = row.original


            const mutation = useMutation({
                mutationFn: async (id) => {
                    await fetch(`/api/sts/${id}`, {
                        method: 'DELETE'
                    }).then(data => data.json())
                },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['stsadmin'] })
                    toast({ title: "STS deleted" })
                },
                onError: (err) => {
                    toast({ title: "STS not deleted" })
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
                                onClick={() => { mutation.mutate(data.id) }}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {open ? <StsOperationDialog open={open} setOpen={setOpen} data={data}></StsOperationDialog>
                        : ""
                    }
                </>
            )
        },
    },
]