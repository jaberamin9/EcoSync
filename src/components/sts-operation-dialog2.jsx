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
import SelectDropdownWce from "./SelectDropdown"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react"
import SelectDropdown from "./SelectDropdown"
import LeafLetMapRouting from "./LeafLetMapRouting"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


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

async function updateCurrentLandfillCapacity(credentials, id) {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/landfill/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

export function StsOperationDialog2({ open, setOpen, data, add = false }) {
    const [arrivalTime, setArrivalTime] = useState(add ? new Date() : (data) ? data.arrivalTime : "")
    const [departureTime, setDepartureTime] = useState(add ? new Date() : (data) ? data.departureTime : "")
    const [volume, setVolume] = useState((add) ? "" : (data) ? data.volumeCollection : "")
    const [tempVolume, setTempVolume] = useState((add) ? "" : (data) ? data.volumeCollection : "")
    const [totlaKiloMeter, setTotlaKiloMeter] = useState(add ? "" : (data) ? data.totlaKiloMeter : "")
    const [stsID, setStsID] = useState("")
    const [stsLocation, setStsLocation] = useState((data) ? data.stsLocation : "")
    const [alllandfillLocation, setAlllandfillLocation] = useState()
    const [time, setTime] = useState("");
    const [popupText, setPopupText] = useState("");
    const [landfillName, setLandfillName] = useState("");
    const [shortestRoute, setShortestRoute] = useState(false);
    const [isSingleVehicle, setIsSingleVehicle] = useState(true);


    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [vehiclesSelect, setVehiclesSelect] = useState([])
    const [vehiclesSelected, setVehiclesSelected] = useState((data) ? data.vehicle_id : "")
    const [landfillSelect, setLandfillSelect] = useState([])
    const [landfillSelected, setLandfillSelected] = useState((data) ? data.landfill_id : "")
    const [loadings, setLoadings] = useState(true);
    const [mapLoading, setMapLoading] = useState(false);

    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)

    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        setLoading(true)
        let res
        if (add) {
            const updateCapacity = await updateCurrentLandfillCapacity({
                capacity: Number(volume)
            }, landfillSelected);

            if (updateCapacity.success) {
                res = await addWce({
                    stsId: stsID,
                    vehicleId: vehiclesSelected,
                    landfillId: landfillSelected,
                    volumeCollection: volume,
                    arrivalTime: arrivalTime,
                    departureTime: departureTime,
                    totlaKiloMeter: totlaKiloMeter
                });
                if (res.success) {
                    setLoading(false)
                    setOpen(false)
                    queryClient.invalidateQueries({ queryKey: ['wcemeneger'] })
                } else {
                    setError(res.error)
                    setLoading(false)
                }
            } else {
                setError(updateCapacity.error)
                setLoading(false)
            }
        } else {
            const updateCapacity = await updateCurrentLandfillCapacity({
                capacity: -(Number(tempVolume) - Number(volume))
            }, landfillSelected);

            if (updateCapacity.success) {
                setTempVolume(volume)
                res = await updateWce({
                    stsId: data.stsId,
                    vehicleId: vehiclesSelected,
                    landfillId: landfillSelected,
                    volumeCollection: volume,
                    arrivalTime: arrivalTime,
                    departureTime: departureTime,
                    totlaKiloMeter: totlaKiloMeter
                }, data.id);
                if (res.success) {
                    setLoading(false)
                    setOpen(false)
                    queryClient.invalidateQueries({ queryKey: ['wcemeneger'] })
                } else {
                    setError(res.error)
                    setLoading(false)
                }
            } else {
                setError(updateCapacity.error)
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        async function fetchData() {
            let res = await getVehicles();
            if (res.success) {
                let data = res.vehicles.sort(function (item1, item2) {
                    const costPerKilometer1 = (item1.fuelcostUnloaded + (volume / item1.capacity) * (item1.fuelcostLoaded - item1.fuelcostUnloaded))
                    const costPerKilometer2 = (item2.fuelcostUnloaded + (volume / item2.capacity) * (item2.fuelcostLoaded - item2.fuelcostUnloaded))
                    return costPerKilometer1 - costPerKilometer2
                })
                data = data.map(item => {
                    return {
                        value: item._id,
                        label: item.type + " = " + item.capacity + "T"
                    }
                })
                if (vehiclesSelected.length != 0) {
                    const selected = data.filter((item) => {
                        return item.value === vehiclesSelected
                    })
                    setVehiclesSelected(selected[0]?.value)
                }
                setVehiclesSelect(data)
                setLoadings(false)
            }
        }
        fetchData()
    }, [volume])

    useEffect(() => {
        async function fetchData3() {
            let res = await getStsID();
            if (res.success) {
                (data) ? '' : setStsLocation([res.sts.latitude, res.sts.longitude])
                setPopupText(res.sts.wardNumber)
                setStsID(res.sts._id)
            }
        }

        async function fetchData2() {
            let res = await getLandfill();
            if (res.success) {
                const data = res.data.map(item => {
                    return {
                        value: item._id,
                        label: item.landfillName,
                        location: [item.latitude, item.longitude],
                    }
                })
                if (landfillSelected.length != 0) {
                    const selected = data.filter((item) => {
                        return item.value === landfillSelected
                    })
                    setLandfillSelected(selected[0]?.value)
                }
                setLandfillSelect(data)
                setAlllandfillLocation(data)
                setLoadings(false)
            }
        }
        fetchData3()
        fetchData2()
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

                    <div className="flex gap-2">
                        <div className="grid w-auto items-center gap-1.5">
                            <Label htmlFor="disposed">Volume Collection</Label>
                            <Input onChange={e => setVolume(e.target.value)} value={volume} className="w-[150px] h-9" type="text" placeholder="volume collection" />
                        </div>
                        <div className="grid w-auto items-center gap-1.5">
                            <Label htmlFor="disposed">Totla KiloMeter</Label>
                            <Input onChange={e => setTotlaKiloMeter(e.target.value)} value={totlaKiloMeter} className="w-[150px] h-9 text-blue-500" type="text" placeholder="totla kiloMeter" />
                        </div>
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

                    <div className="grid w-auto max-w-sm items-center gap-1.5">
                        <RadioGroup defaultValue="Single Vehicle" className='flex gap-2 mb-1' >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Single Vehicle" id="r1" onClick={e => setIsSingleVehicle(true)} />
                                <Label htmlFor="r1">Single Vehicle</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Vehicle Fleet" id="r2" onClick={e => setIsSingleVehicle(false)} />
                                <Label htmlFor="r2">Vehicle Fleet</Label>
                            </div>
                        </RadioGroup>

                        <Label htmlFor="disposed">Select Vehicles</Label>
                        {isSingleVehicle ?
                            <SelectDropdownWce
                                open={open1}
                                setOpen={setOpen1}
                                value={vehiclesSelected}
                                setValue={setVehiclesSelected}
                                data={vehiclesSelect}
                                selectName="select vehicles">
                            </SelectDropdownWce>
                            : <div className="p-2 rounded-md bg-blue-100 text-black text-sm">Not implemented yet (task: 4)</div>
                        }

                    </div>

                    <div className="grid w-auto max-w-sm items-center gap-1.5">
                        <Label htmlFor="disposed">Select Landfill</Label>
                        <SelectDropdown
                            open={open2}
                            setOpen={setOpen2}
                            value={landfillSelected}
                            setValue={setLandfillSelected}
                            data={landfillSelect}
                            selectName="select landfill">
                        </SelectDropdown>
                    </div>


                    {error != "" ? <p className="text-[11px] bg-red-100 p-1 rounded-md mx-6 text-center">{error}</p> : ""}

                    <DialogFooter className="sm:justify-end">
                        <Button onClick={handleSubmit} type="submit" variant="secondary" disabled={loading}>
                            Update
                            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                        </Button>
                    </DialogFooter>

                </div>
                <div className="relative flex justify-center items-center">
                    <div>

                        {totlaKiloMeter ? <div className="md:w-[350px] w-[200px] min-w-[300px] mt-5 mb-2 bg-gray-100 rounded-md p-2 text-sm font-normal">
                            {landfillName ? <span className=" text-black-500 mb-2 font-normal">Name: <span className=" text-blue-500 font-bold">{landfillName}</span> <br></br></span> : ''}
                            Total distance is
                            <span className=" text-blue-500 font-bold"> {totlaKiloMeter} km </span>
                            {time ? "and total time is" : ""}
                            {time ? <span className=" text-blue-500 font-bold"> {time} minutes </span> : ""}
                            <div className="flex justify-end items-right space-x-2">
                                <Button variant='custom' className='px-2 py-1 h-auto text-xs font-semibold' onClick={(e) => setShortestRoute((pre) => !pre)}>shortest route</Button>
                            </div>
                        </div> : <div className="md:w-[350px] w-[200px] min-w-[300px] mt-5 mb-2 bg-gray-100 rounded-md p-2 text-sm font-semibold">select location <div className="flex justify-end items-right space-x-2">
                            <Button variant='custom' className='px-2 py-1 h-auto text-xs font-semibold' onClick={(e) => setShortestRoute((pre) => !pre)}>shortest route</Button>
                        </div></div>}

                        <LeafLetMapRouting
                            latlng={stsLocation}
                            setMapLoading={setMapLoading}
                            alllandfillLocation={alllandfillLocation}
                            popupText={popupText}
                            setDistance={setTotlaKiloMeter}
                            setTime={setTime}
                            shortestRoute={shortestRoute}
                            setShortestRoute={setShortestRoute}
                            setLandfillSelected={setLandfillSelected}
                            setLandfillName={setLandfillName}
                            isClickAble={false}>
                        </LeafLetMapRouting>
                    </div>
                    {mapLoading ? <div className="bg-white shadow-2xl flex justify-center items-center rounded-md w-[100px] h-[100px] absolute z-50">
                        <div className="flex flex-col justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /><span className="mt-2 text-sm">loading..</span></div>
                    </div> : ""}
                </div>
            </DialogContent>
        </Dialog >
    )
}

