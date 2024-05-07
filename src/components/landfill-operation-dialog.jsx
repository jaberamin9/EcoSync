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
import MultiSelectDropdown from "./multi-select-dropdown"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react"
import LeafLetMap from "./leaf-let-map"


async function updateLandfill(credentials, id) {
    return fetch(`/api/landfill/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function addeLandfill(credentials) {
    return fetch(`/api/landfill`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function getUser() {
    return fetch(`/api/users/?role=Landfill Manager`, {
        method: 'GET'
    }).then(data => data.json())
}



export function LandfillOperationDialog({ open, setOpen, data, add = false }) {
    const [landfillName, setLandfillName] = useState((data) ? data.landfillName : "")
    const [capacity, setCapacity] = useState((data) ? data.capacity : "")
    const [operationalTimespan, setOperationalTimespan] = useState((data) ? data.operationalTimespan : new Date())
    const [location, setLocation] = useState((data) ? data.location : "")
    const [value, onChange] = useState(['10:00', '11:00']);
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
            <DialogContent className="flex gap-4 flex-wrap justify-center items-center md:flex-nowrap h-[90vh] md:h-auto overflow-y-auto">
                <div className="md:min-w-[250px] p-1 w-auto flex flex-col gap-3">
                    <DialogHeader>
                        <DialogTitle>{add ? "Add Landfill" : "Update"}</DialogTitle>
                    </DialogHeader>

                    <div className="grid w-auto max-w-sm items-center gap-1.5">
                        <Label htmlFor="disposed">Landfill Name</Label>
                        <Input onChange={e => setLandfillName(e.target.value)} value={landfillName} className="w-[300px] h-9" type="text" placeholder="Landfill Name" />
                    </div>
                    <div className="grid w-auto max-w-sm items-center gap-1.5">
                        <Label htmlFor="disposed">Capacity</Label>
                        <Input onChange={e => setCapacity(e.target.value)} value={capacity} className="w-[300px] h-9" type="number" placeholder="Capacity" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="disposed">Operational Timespan</Label>
                        <DatePicker
                            className="h-[32px] focus-visible:outline-none focus-visible:border-2 focus-visible:bg-[#f1f5f9] hover:bg-[#f1f5f9] hover:cursor-pointer focus-visible:border-[#e2e8f0]  border-[#e2e8f0] border-2 rounded-md w-full"
                            dateFormat="dd/MM/yyyy h:mm aa"
                            showIcon
                            showTimeInput
                            timeInputLabel="Time:"
                            selected={operationalTimespan}
                            onChange={(date) => setOperationalTimespan(date)}
                            icon={<Icon icon="uil:calender" width="24" height="24" />}
                        />
                    </div>
                    <div className="grid w-[300px] max-w-sm items-center gap-1.5">
                        <Label htmlFor="disposed">Select Landfill Manager</Label>
                        <MultiSelectDropdown formFieldName={"countries"}
                            open={open1}
                            setOpen={setOpen1}
                            value={userSelectedList}
                            setValue={setUserSelectedList}
                            data={userSelect}
                            selectName="select landfill manager">
                        </MultiSelectDropdown>

                    </div>
                    <div className="grid w-[300px] max-w-sm items-center gap-1.5">
                        <Label htmlFor="disposed">Enter Location</Label>
                        <div className="flex gap-2">
                            <Input disabled value={location} className="h-9" type="text" placeholder="Location" />
                        </div>
                    </div>
                    {error != "" ? <p className="text-[11px] bg-red-100 p-1 rounded-md mx-6 text-center">{error}</p> : ""}

                    <DialogFooter className="sm:justify-end">
                        <Button onClick={handleSubmit} type="submit" className='w-full' variant="custom" disabled={loading}>
                            {add ? 'Add' : 'Update'}
                            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                        </Button>
                    </DialogFooter>
                </div>
                <LeafLetMap setLatlng={setLocation} latlng={location} popupText={landfillName}></LeafLetMap>
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