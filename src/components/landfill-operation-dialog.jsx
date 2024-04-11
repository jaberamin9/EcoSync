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

async function updateLandfill(credentials, id) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/landfill/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function addeLandfill(credentials) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/landfill`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function getUser() {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/users/?role=Landfill Manager`, {
        method: 'GET'
    }).then(data => data.json())
}



export function LandfillOperationDialog({ open, setOpen, data, add = false }) {
    const [landfillName, setLandfillName] = useState(add ? "" : (data) ? data.landfillName : "")
    const [capacity, setCapacity] = useState(add ? "" : (data) ? data.capacity : "")
    const [operationalTimespan, setOperationalTimespan] = useState((data) ? data.operationalTimespan : "")
    const [location, setLocation] = useState((data) ? data.location : "")
    const [value, onChange] = useState(['10:00', '11:00']);
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [userSelect, setUserSelect] = useState([])
    const [userSelectedList, setUserSelectedList] = useState([])
    const [loadings, setLoadings] = useState(true);


    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        setLoading(true)
        const { lat, long } = extractLatLon(String(location))
        let res
        if (add) {
            res = await addeLandfill({
                landfillName,
                operationalTimespan,
                capacity,
                latitude: lat,
                longitude: long,
                manager: userSelectedList
            });
        } else {
            res = await updateLandfill({
                landfillName,
                operationalTimespan,
                capacity,
                latitude: lat,
                longitude: long,
                manager: userSelectedList
            }, data.id);
        }

        if (res.success) {
            setLoading(false)
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['landfill'] })
        } else {
            setError(res.error)
            setLoading(false)
        }
    }


    useEffect(() => {
        async function fetchData() {
            let res = await getUser();
            if (res.success) {
                setUserSelect(res.users)
                setLoadings(false)
            }
        }
        fetchData()
    }, []);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md w-auto">
                <DialogHeader>
                    <DialogTitle>{add ? "Add Landfill" : "Update"}</DialogTitle>
                    <DialogDescription>
                        Add Landfill
                    </DialogDescription>
                </DialogHeader>

                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Landfill Name</Label>
                    <Input onChange={e => setLandfillName(e.target.value)} value={landfillName} className="w-[300px] h-9" type="text" placeholder="Landfill Name" />
                </div>
                <div className="grid w-auto max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Capacity</Label>
                    <Input onChange={e => setCapacity(e.target.value)} value={capacity} className="w-[300px] h-9" type="text" placeholder="Capacity" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Operational Timespan</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[300px] justify-start text-left font-normal",
                                    !operationalTimespan && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {operationalTimespan ? format(operationalTimespan, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={operationalTimespan}
                                onSelect={setOperationalTimespan}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>


                </div>
                <div className="grid w-[300px] max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Select Landfill Manager</Label>
                    <MultiSelectDropdown formFieldName={"countries"}
                        options={userSelect}
                        onChange={val => { setUserSelectedList(val) }}>
                    </MultiSelectDropdown>
                </div>
                <div className="grid w-[300px] max-w-sm items-center gap-1.5">
                    <Label htmlFor="disposed">Enter Location</Label>
                    <div className="flex gap-2">
                        <Input onChange={e => setLocation(e.target.value)} value={location} className="h-9" type="text" placeholder="Location" />
                        <Button className='h-9'>
                            <a href="https://www.google.com/maps/@23.7953844,90.9511541,7.25z?entry=ttu" target="_blank">Get Location</a>
                        </Button>
                    </div>
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

function extractLatLon(str) {
    const pairs = str.split(/\s*,\s*/);
    const lat = pairs[0];
    const long = pairs[1];
    return { lat, long };
}