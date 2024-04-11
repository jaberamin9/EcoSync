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
import { useEffect, useState } from "react"

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
import TimeRangePicker from "@wojtekmaj/react-timerange-picker"
import Map from "@/components/map";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import MultiSelectDropdown from "./MultiSelectDropdown"
import SelectDropdownWce from "./SelectDropdownWce"

async function updateWce(credentials, id) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/wce/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function addWce(credentials) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/wce`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function getVehicles() {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/vehicles`, {
        method: 'GET'
    }).then(data => data.json())
}

async function getLandfill() {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/landfill`, {
        method: 'GET'
    }).then(data => data.json())
}
async function getStsID() {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/sts`, {
        method: 'GET'
    }).then(data => data.json())
}

export function StsOperationDialog2({ open, setOpen, data, add = false }) {
    const [arrivalTime, setArrivalTime] = useState(add ? "" : (data) ? data.arrivalTime : "")
    const [departureTime, setDepartureTime] = useState(add ? "" : (data) ? data.departureTime : "")
    const [volume, setVolume] = useState((add) ? "" : (data) ? data.volumeCollection : "")
    const [totlaKiloMeter, setTotlaKiloMeter] = useState(add ? "" : (data) ? data.totlaKiloMeter : "")
    const [stsID, setStsID] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [vehiclesSelect, setVehiclesSelect] = useState([])
    const [vehiclesSelected, setVehiclesSelected] = useState((data) ? data.manager : [])
    const [landfillSelect, setLandfillSelect] = useState([])
    const [landfillSelected, setLandfillSelected] = useState((data) ? data.manager : [])
    const [loadings, setLoadings] = useState(true);

    const queryClient = useQueryClient();


    const handleSubmit = async () => {
        setLoading(true)
        let res
        if (add) {
            res = await addWce({
                stsId: stsID,
                vehicleId: vehiclesSelected,
                landfillId: landfillSelected,
                volumeCollection: volume,
                arrivalTime: arrivalTime,
                departureTime: departureTime,
                totlaKiloMeter: totlaKiloMeter
            });
        } else {
            res = await updateWce({
                stsId: data.stsId,
                vehicleId: vehiclesSelected,
                landfillId: landfillSelected,
                volumeCollection: volume,
                arrivalTime: arrivalTime,
                departureTime: departureTime,
                totlaKiloMeter: totlaKiloMeter
            }, data.id);
        }

        if (res.success) {
            setLoading(false)
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['wcemeneger'] })
        } else {
            setError(res.error)
            setLoading(false)
        }
    }


    useEffect(() => {
        async function fetchData3() {
            let res = await getStsID();
            if (res.success) {
                setStsID(res.sts)
                console.log(res.sts)
            }
        }
        async function fetchData() {
            let res = await getVehicles();
            if (res.success) {
                setVehiclesSelect(res.vehicles)
                setLoadings(false)
            }
        }
        async function fetchData2() {
            let res = await getLandfill();
            if (res.success) {
                setLandfillSelect(res.wce)
                setLoadings(false)
            }
        }
        fetchData3()
        fetchData()
        fetchData2()
    }, []);



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md w-auto">
                <DialogHeader>
                    <DialogTitle>{add ? "Add STS" : "Update"}</DialogTitle>
                    <DialogDescription>
                        Add STS
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-2">
                    <div className="grid w-auto items-center gap-1.5">
                        <Label htmlFor="disposed">Volume Collection</Label>
                        <Input onChange={e => setVolume(e.target.value)} value={volume} className="w-[150px] h-9" type="text" placeholder="volume collection" />
                    </div>
                    <div className="grid w-auto items-center gap-1.5">
                        <Label htmlFor="disposed">Totla KiloMeter</Label>
                        <Input onChange={e => setTotlaKiloMeter(e.target.value)} value={totlaKiloMeter} className="w-[150px] h-9" type="text" placeholder="totla kiloMeter" />
                    </div>
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

                <div className="grid w-[300px] max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Select Vehicles</Label>
                    <SelectDropdownWce formFieldName={"vehicles"}
                        options={vehiclesSelect}
                        onChange={val => { setVehiclesSelected(val) }}>
                    </SelectDropdownWce>
                </div>

                <div className="grid w-[300px] max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Select Landfill</Label>
                    <SelectDropdownWce formFieldName={"vehicles"}
                        options={landfillSelect}
                        onChange={val => { setLandfillSelected(val) }}
                        landfillName={true}>
                    </SelectDropdownWce>
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
