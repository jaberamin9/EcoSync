"use client"

import { ColumnDef } from "@tanstack/react-table"
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
import { AddViewDialog } from "@/components/add-view-dialog";
import { useState } from "react";
import { BillAndSlip } from "@/components/bill-and-slip";
import Map from "@/components/map";
import LandfillOperation from "./page";
import { LandfillOperationDialog } from "@/components/landfill-operation-dialog";
import { StsOperationDialog } from "@/components/sts-operation-dialog";
import { StsOperationDialog2 } from "@/components/sts-operation-dialog2";

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
        accessorKey: "landfillName",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Landfill Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("landfillName")}</div>
        },
    }, {
        accessorKey: "landfillCapacity",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Landfill Capacity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("landfillCapacity")}</div>
        },
    }, {
        accessorKey: "volumeCollection",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    volumeCollection
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("volumeCollection")}</div>
        },
    }, {
        accessorKey: "arrivalTime",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    arrival Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("arrivalTime"))
            const formatted = formatDate(date)
            return <div className="text-center text-[12px]">{formatted[0]}<br />{formatted[1]}</div>
        },
    }, {
        accessorKey: "departureTime",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Departure Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("departureTime"))
            const formatted = formatDate(date)
            return <div className="text-center text-[12px]">{formatted[0]}<br />{formatted[1]}</div>
        },
    }, {
        accessorKey: "vehicleType",
        header: ({ column }) => {
            return (
                <Button
                    className="flex p-0 justify-center w-full"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Vehicle Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("vehicleType")}</div>
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
                    <div className="cursor-pointer text-center bg-green-400 text-white rounded-sm w-[100px] p-1">see on map</div>
                </div>
                <Map location={row.getValue("location")} open={open} setOpen={setOpen}></Map>

            </>
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
                    await fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/wce/${id}`, {
                        method: 'DELETE'
                    }).then(data => data.json())
                },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['wcemeneger'] })
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
                                onClick={() => { mutation.mutate(landfill.id) }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <StsOperationDialog2 open={open} setOpen={setOpen} data={landfill}></StsOperationDialog2>
                </>
            )
        },
    },
]