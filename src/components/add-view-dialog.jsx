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
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react"


async function updateWde(credentials, id) {
    return fetch(`/api/wde/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function addeWde(credentials) {
    return fetch(`/api/wde`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function updateStatus(credentials, id) {
    return fetch(`/api/wce/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}



export function AddViewDialog({ isUpdate, open, setOpen, wde, addWde = false }) {
    const [arrivalTime, setArrivalTime] = useState(addWde ? new Date() : (wde) ? wde.arrivalTime : new Date())
    const [departureTime, setDepartureTime] = useState(addWde ? new Date() : (wde) ? wde.departureTime : new Date())
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

                if (update_status.success) {
                    setLoading(false)
                    setOpen(false)
                    queryClient.invalidateQueries({ queryKey: ['insertWde'] })
                } else {
                    setError(update_status.message)
                }
            } else {
                setLoading(false)
                setOpen(false)
                queryClient.invalidateQueries({ queryKey: ['wde'] })
            }
        } else {
            setError(res.message)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isUpdate ? "" : <Button className='ml-3' variant="outline">Add</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md flex flex-col gap-4 w-auto h-auto">
                <DialogHeader>
                    <DialogTitle>{addWde ? "Add Wde" : "Update"}</DialogTitle>
                </DialogHeader>

                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Volume Disposed</Label>
                    <Input onChange={e => setVolume(e.target.value)} value={volume} className="w-full h-9" type="number" placeholder="Volume Disposed" />
                </div>


                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Arrival Time</Label>
                    <DatePicker
                        className="h-[32px] flex items-center focus-visible:outline-none focus-visible:border-2 focus-visible:bg-[#f1f5f9] hover:bg-[#f1f5f9] hover:cursor-pointer focus-visible:border-[#e2e8f0]  border-[#e2e8f0] border-2 rounded-md w-full"
                        dateFormat="dd/MM/yyyy h:mm aa"
                        showIcon
                        showTimeInput
                        timeInputLabel="Time:"
                        selected={arrivalTime}
                        onChange={(date) => setArrivalTime(date)}
                        icon={<Icon icon="uil:calender" width="24" height="24" />}
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Departure Time</Label>
                    <DatePicker
                        className="h-[32px] focus-visible:outline-none focus-visible:border-2 focus-visible:bg-[#f1f5f9] hover:bg-[#f1f5f9] hover:cursor-pointer focus-visible:border-[#e2e8f0]  border-[#e2e8f0] border-2 rounded-md w-full"
                        dateFormat="dd/MM/yyyy h:mm aa"
                        showIcon
                        showTimeInput
                        timeInputLabel="Time:"
                        selected={departureTime}
                        onChange={(date) => setDepartureTime(date)}
                        icon={<Icon icon="uil:calender" width="24" height="24" />}
                    />
                </div>


                {error != "" ? <p className="text-[11px] bg-red-100 p-1 rounded-md mx-6 text-center">{error}</p> : ""}

                <DialogFooter className="sm:justify-end">
                    <Button onClick={handleSubmit} type="submit" className='w-full' variant="custom" disabled={loading}>
                        {addWde ? 'Add' : 'Update'}
                        {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}