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
import SelectDropdown from "./SelectDropdown"

async function updateLandfill(credentials, id) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/vehicles/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function addeLandfill(credentials) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/vehicles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function getSts() {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/sts`, {
        method: 'GET'
    }).then(data => data.json())
}



export function VehiclesOperationDialog({ open, setOpen, data, add = false }) {
    const [vehicleId, setVehicleId] = useState(add ? "" : (data) ? data.vehicleId : "")
    const [capacity, setCapacity] = useState(add ? "" : (data) ? data.capacity : "")
    const [type, setType] = useState((data) ? data.type : "")
    const [fuelcostLoaded, setFuelcostLoaded] = useState((data) ? data.fuelcostLoaded : "")
    const [fuelcostUnloaded, setFuelCostUnloaded] = useState((data) ? data.fuelcostUnloaded : "")
    const [stsId, SetStsId] = useState((data) ? data.stsId : "")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [stsList, setStsList] = useState([])
    const [vehicleTypeSelected, setVehicleTypeSelected] = useState()
    const [stsSelected, setStsSelected] = useState("")
    const [loadings, setLoadings] = useState(true);

    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        setLoading(true)
        const { type, capacity } = extract(vehicleTypeSelected)
        const stsId = stsSelected.split(/\s*:\s*/)[1]
        let res
        if (add) {
            res = await addeLandfill({
                vehicleId,
                type,
                capacity,
                fuelcostLoaded,
                fuelcostUnloaded,
                stsId
            });
        } else {
            res = await updateLandfill({
                vehicleId,
                type,
                capacity,
                fuelcostLoaded,
                fuelcostUnloaded,
                stsId
            }, data.id);
        }

        if (res.success) {
            setLoading(false)
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['vehicles'] })
        } else {
            setError(res.error)
            setLoading(false)
        }
    }


    useEffect(() => {
        async function fetchData() {
            let res = await getSts();
            if (res.success) {
                const newData = res.sts.map(item => {
                    return {
                        id: item._id,
                        value: item.wardNumber + ":" + item._id,
                    }
                })
                setStsList(newData)
                setLoadings(false)
            }
        }
        fetchData()
    }, []);

    const vehiclesType = [
        { id: 1, value: 'Open Truck:3' },
        { id: 2, value: 'Dump Truck:5' },
        { id: 3, value: 'Compactor:7' },
        { id: 4, value: 'Container Carrier:15' },
    ]


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md w-auto">
                <DialogHeader>
                    <DialogTitle>{add ? "Add vehicle" : "Update"}</DialogTitle>
                    <DialogDescription>
                        Add vehicle
                    </DialogDescription>
                </DialogHeader>

                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Vehicle Id</Label>
                    <Input onChange={e => setVehicleId(e.target.value)} value={vehicleId} className="w-[300px] h-9" type="text" placeholder="VehicleId" />
                </div>

                <div className="grid w-[300px] max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Select vehicles type</Label>
                    <SelectDropdown formFieldName={"vehiclesType"}
                        options={vehiclesType}
                        onChange={val => { setVehicleTypeSelected(val) }}>
                    </SelectDropdown>
                </div>

                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Fuel cost loaded</Label>
                    <Input onChange={e => setFuelcostLoaded(e.target.value)} value={fuelcostLoaded} className="w-[300px] h-9" type="text" placeholder="Fuel cost loaded" />
                </div>

                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Fuel cost Unloaded</Label>
                    <Input onChange={e => setFuelCostUnloaded(e.target.value)} value={fuelcostUnloaded} className="w-[300px] h-9" type="text" placeholder="Fuel cost Unloaded" />
                </div>

                <div className="grid w-[300px] max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Select STS</Label>
                    <SelectDropdown formFieldName={"sts"}
                        options={stsList}
                        onChange={val => { setStsSelected(val) }}
                        vehicles={true}>
                    </SelectDropdown>
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

function extract(str) {
    const pairs = str.split(/\s*:\s*/);
    const type = pairs[0];
    const capacity = pairs[1];
    return { type, capacity };
}