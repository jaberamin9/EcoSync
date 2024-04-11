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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function updateWde(credentials, id) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/wde/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function addeWde(credentials) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/wde`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function updateStatus(credentials, id) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/wce/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}


async function updateMyLandfill(credentials, id) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/landfill/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}


export function AddViewDialog({ isUpdate, open, setOpen, wde, addWde = false }) {
    const [arrivalTime, setArrivalTime] = useState(addWde ? "" : (wde) ? wde.arrivalTime : "")
    const [departureTime, setDepartureTime] = useState(addWde ? "" : (wde) ? wde.departureTime : "")
    const [volume, setVolume] = useState((wde) ? wde.volumeDisposed ? wde.volumeDisposed : wde.volumeCollection : "")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


    const queryClient = useQueryClient();

    const handleSubmit = async e => {
        setLoading(true)
        e.preventDefault();
        let res
        if (addWde) {
            res = await addeWde({
                landfillId: wde.landfill_id,
                stsId: wde.sts_id,
                vehicleId: wde.vehicle_id,
                volumeDisposed: volume,
                arrivalTime,
                departureTime,
                totlaKiloMeter: wde.totlaKiloMeter
            });
        } else {
            res = await updateWde({
                volumeDisposed: volume,
                arrivalTime,
                departureTime,
            }, wde.id);
        }

        if (res.success) {
            if (addWde) {
                const update_status = await updateStatus({
                    running: false
                }, wde.id);
                const update_status2 = await updateMyLandfill({
                    capacity: (Number(wde.landfill_capacity) - Number(volume))
                }, wde.landfill_id);

                console.log(update_status2, update_status)
                if (update_status.success) {
                    setLoading(false)
                    setOpen(false)
                    queryClient.invalidateQueries({ queryKey: ['insertWde'] })
                }
            } else {
                setLoading(false)
                setOpen(false)
                queryClient.invalidateQueries({ queryKey: ['wde'] })
            }
        }
        setError(res.error)
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isUpdate ? "" : <Button className='ml-3' variant="outline">Add</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md w-auto">
                <DialogHeader>
                    <DialogTitle>{addWde ? "Add Wde" : "Update"}</DialogTitle>
                    <DialogDescription>
                        Add Waste disposal event
                    </DialogDescription>
                </DialogHeader>

                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Volume Disposed</Label>
                    <Input onChange={e => setVolume(e.target.value)} value={volume} className="w-[300px] h-9" type="text" placeholder="Volume Disposed" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Arrival Time</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[300px] justify-start text-left font-normal",
                                    !arrivalTime && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {arrivalTime ? format(arrivalTime, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={arrivalTime}
                                onSelect={setArrivalTime}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Departure Time</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[300px] justify-start text-left font-normal",
                                    !departureTime && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {departureTime ? format(departureTime, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={departureTime}
                                onSelect={setDepartureTime}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {error != "" ? <p className="text-[11px] bg-red-100 p-1 rounded-md mx-6 text-center">{error}</p> : ""}

                <DialogFooter className="sm:justify-end">
                    <Button onClick={handleSubmit} type="submit" variant="secondary" disabled={loading}>
                        Update
                        {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}