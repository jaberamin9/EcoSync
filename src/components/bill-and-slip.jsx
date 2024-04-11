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
    const date = sMonth + "/" + sDay + "/" + sYear + " "
    const time = sHour + ":" + sMinute + " " + sAMPM
    return [date, time];
}
function padValue(value) {
    return (value < 10) ? "0" + value : value;
}

export function BillAndSlip({ open, setOpen, data }) {
    const [arrivalTime, setArrivalTime] = useState("")
    const [departureTime, setDepartureTime] = useState("")
    const [volume, setVolume] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md w-auto">
                <DialogHeader>
                    <DialogTitle>Bill info</DialogTitle>
                </DialogHeader>

                <div className="w-auto flex items-center gap-24 font-bold">
                    <p className="text-[14px]">Time: {data ? formatDate(data.time) : ""}</p>
                    <p className="text-[14px]">Total Fuel: {data ? data.totalFuel : ""}T</p>
                </div>
                <div className="w-auto flex items-center gap-24 font-bold">
                    <p className="text-[14px]">Volume Disposed: {data ? data.volumeDisposed : ""}T</p>
                </div>
                <div className="w-auto items-center gap-24 font-semibold">
                    <p className="text-[14px]">Vehic Details:</p>
                    <p className=" ms-5 text-[13px]">Id: {data ? data.truckDetails.vehicleId : ""}</p>
                    <p className=" ms-5 text-[13px]">Type: {data ? data.truckDetails.type : ""}</p>
                    <p className=" ms-5 text-[13px]">Capacity: {data ? data.truckDetails.capacity : ""}</p>
                    <p className=" ms-5 text-[13px]">Fuel cost loaded: {data ? data.truckDetails.fuelcostLoaded : ""}৳</p>
                    <p className=" ms-5 text-[13px]">Fuel cost unloaded: {data ? data.truckDetails.fuelcostUnloaded : ""}৳</p>
                </div>
                <div className="w-auto flex items-center gap-24 font-bold">
                    <p className="text-[14px]">Total Fuel Cost: {data ? Math.round(data.totalFuelCost) : ""}৳</p>
                </div>
                {/* <DialogFooter className="sm:justify-end">
                    <Button type="submit" variant="secondary" disabled={loading}>
                        PDF
                        {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                    </Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog >
    )
}