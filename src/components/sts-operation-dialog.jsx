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
import MultiSelectDropdown from "./MultiSelectDropdown"
import LeafLetMap from "./LeafLetMap"



async function updateSTS(credentials, id) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/sts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function addeSTS(credentials) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/sts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function getUser() {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/users/?role=STS Manager`, {
        method: 'GET'
    }).then(data => data.json())
}



export function StsOperationDialog({ open, setOpen, data, add = false }) {
    const [wardNumber, setWardNumber] = useState(add ? "" : (data) ? data.wardNumber : "")
    const [capacity, setCapacity] = useState(add ? "" : (data) ? data.capacity : "")
    const [location, setLocation] = useState((data) ? data.location : "")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [userSelect, setUserSelect] = useState([])
    const [userSelectedList, setUserSelectedList] = useState((data) ? data.manager_id : [])
    const [loadings, setLoadings] = useState(true);
    const [open1, setOpen1] = useState(false)

    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        setLoading(true)
        const { lat, long } = extractLatLon(String(location))
        let res
        if (add) {
            res = await addeSTS({
                wardNumber,
                capacity,
                latitude: lat,
                longitude: long,
                manager: userSelectedList
            });
        } else {
            res = await updateSTS({
                wardNumber,
                capacity,
                latitude: lat,
                longitude: long,
                manager: userSelectedList
            }, data.id);
        }

        if (res.success) {
            setLoading(false)
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['stsadmin'] })
        } else {
            setError(res.error)
            setLoading(false)
        }
    }


    useEffect(() => {
        async function fetchData() {
            let res = await getUser();
            if (res.success) {
                const data = res.users.map(item => {
                    return {
                        value: item._id,
                        label: item.email
                    }
                })
                setUserSelect(data)
                setLoadings(false)
            }
        }
        fetchData()
    }, []);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex gap-4 flex-wrap md:flex-nowrap">
                <div className="sm:max-w-md w-auto flex flex-col gap-3">
                    <DialogHeader>
                        <DialogTitle>{add ? "Add STS" : "Update"}</DialogTitle>
                        <DialogDescription>
                            Add STS
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid w-auto max-w-sm items-center gap-1.5">
                        <Label htmlFor="disposed">Ward Number</Label>
                        <Input onChange={e => setWardNumber(e.target.value)} value={wardNumber} className="w-[300px] h-9" type="text" placeholder="Ward Number" />
                    </div>
                    <div className="grid w-auto max-w-sm items-center gap-1.5">
                        <Label htmlFor="disposed">Capacity</Label>
                        <Input onChange={e => setCapacity(e.target.value)} value={capacity} className="w-[300px] h-9" type="text" placeholder="Capacity" />
                    </div>


                    <div className="grid w-[300px] max-w-sm items-center gap-1.5">
                        <Label htmlFor="disposed">Select STS Manager</Label>
                        <MultiSelectDropdown formFieldName={"countries"}
                            open={open1}
                            setOpen={setOpen1}
                            value={userSelectedList}
                            setValue={setUserSelectedList}
                            data={userSelect}
                            selectName="select user">
                        </MultiSelectDropdown>
                    </div>


                    <div className="grid w-[300px] max-w-sm items-center gap-1.5">
                        <Label htmlFor="disposed">Location</Label>
                        <div className="flex gap-2">
                            <Input disabled value={location} className="h-9" type="text" placeholder="location" />
                            {/* <Button className='h-9'>
                                <a href="https://www.google.com/maps/@23.7953844,90.9511541,7.25z?entry=ttu" target="_blank">Get Location</a>
                            </Button> */}
                        </div>
                    </div>

                    {error != "" ? <p className="text-[11px] bg-red-100 p-1 rounded-md mx-6 text-center">{error}</p> : ""}

                    <DialogFooter className="sm:justify-end">
                        <Button onClick={handleSubmit} type="submit" variant="secondary" disabled={loading}>
                            Update
                            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                        </Button>
                    </DialogFooter>
                </div>
                <LeafLetMap setLatlng={setLocation} latlng={location} popupText={wardNumber}></LeafLetMap>
            </DialogContent >
        </Dialog >
    )
}

function extractLatLon(str) {
    const pairs = str.split(/\s*,\s*/);
    const lat = pairs[0];
    const long = pairs[1];
    return { lat, long };
}