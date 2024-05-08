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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query";
import SelectDropdown from "./select-dropdown"


async function updateLandfill(credentials, id) {
    return fetch(`/api/vehicles/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function addeLandfill(credentials) {
    return fetch(`/api/vehicles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function getSts() {
    return fetch(`/api/sts`, {
        method: 'GET'
    }).then(data => data.json())
}



export function VehiclesOperationDialog({ open, setOpen, data, add = false }) {
    const [vehicleId, setVehicleId] = useState((data) ? data.vehicleId : "")
    const [fuelcostLoaded, setFuelcostLoaded] = useState((data) ? data.fuelcostLoaded : "")
    const [fuelcostUnloaded, setFuelCostUnloaded] = useState((data) ? data.fuelcostUnloaded : "")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [stsList, setStsList] = useState([])
    const [vehicleTypeSelected, setVehicleTypeSelected] = useState((data) ? data.type + ":" + data.capacity : "")
    const [stsSelected, setStsSelected] = useState((data) ? data.sts_id : "")
    const [loadings, setLoadings] = useState(true);
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)


    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        setLoading(true)
        const { type, capacity } = extract(vehicleTypeSelected)
        let res
        if (add) {
            res = await addeLandfill({
                vehicleId,
                type,
                capacity,
                fuelcostLoaded,
                fuelcostUnloaded,
                stsId: stsSelected
            });
        } else {
            res = await updateLandfill({
                vehicleId,
                type,
                capacity,
                fuelcostLoaded,
                fuelcostUnloaded,
                stsId: stsSelected
            }, data.id);
        }

        if (res.success) {
            setLoading(false)
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['vehicles'] })
        } else {
            setError(res.message)
            setLoading(false)
        }
    }


    useEffect(() => {
        async function fetchData() {
            let res = await getSts();
            if (res.success) {
                const data = res.data.map(item => {
                    return {
                        value: item._id,
                        label: "Ward Number: " + item.wardNumber,
                    }
                })
                setStsList(data)
                setLoadings(false)
            }
        }
        fetchData()
    }, []);

    const vehiclesType = [
        { value: 'Open Truck:3', label: 'Open Truck = 3T' },
        { value: 'Dump Truck:5', label: 'Dump Truck = 5T' },
        { value: 'Compactor:7', label: 'Compactor = 7T' },
        { value: 'Container Carrier:15', label: 'Container Carrier = 15T' },
    ]


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md w-auto h-[90vh] md:h-auto overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{add ? "Add vehicle" : "Update vehicle"}</DialogTitle>
                </DialogHeader>

                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Vehicle Id</Label>
                    <Input onChange={e => setVehicleId(e.target.value)} value={vehicleId} className="w-[300px] h-9" type="number" placeholder="VehicleId" />
                </div>

                <div className="grid w-[300px] max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Select vehicles type</Label>
                    <SelectDropdown
                        open={open2}
                        setOpen={setOpen2}
                        value={vehicleTypeSelected}
                        setValue={setVehicleTypeSelected}
                        data={vehiclesType}
                        selectName="select vehicle">
                    </SelectDropdown>
                </div>

                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Fuel cost loaded</Label>
                    <Input onChange={e => setFuelcostLoaded(e.target.value)} value={fuelcostLoaded} className="w-[300px] h-9" type="number" placeholder="Fuel cost loaded" />
                </div>

                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Fuel cost Unloaded</Label>
                    <Input onChange={e => setFuelCostUnloaded(e.target.value)} value={fuelcostUnloaded} className="w-[300px] h-9" type="number" placeholder="Fuel cost Unloaded" />
                </div>

                <div className="grid w-[300px] max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Select STS</Label>
                    <SelectDropdown
                        open={open1}
                        setOpen={setOpen1}
                        value={stsSelected}
                        setValue={setStsSelected}
                        data={stsList}
                        selectName="select sts">
                    </SelectDropdown>
                </div>

                {error != "" ? <p className="text-[11px] bg-red-100 p-1 rounded-md mx-6 text-center">{error}</p> : ""}

                <DialogFooter className="sm:justify-end">
                    <Button onClick={handleSubmit} type="submit" className='w-full' variant="custom" disabled={loading}>
                        {add ? 'Add' : 'Update'}
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