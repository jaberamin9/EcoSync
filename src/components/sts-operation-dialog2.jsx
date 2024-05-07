"use client"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query";
import SelectDropdownWce from "./select-dropdown"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react"
import SelectDropdown from "./select-dropdown"
import LeafLetMapRouting from "./leaf-let-map-routing"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from "@/components/ui/table"
import { Switch } from "./ui/switch"



async function updateWce(credentials, id) {
    return fetch(`/api/wce/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function addWce(credentials) {
    return fetch(`/api/wce`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function getVehicles() {
    return fetch(`/api/vehicles`, {
        method: 'GET'
    }).then(data => data.json())
}

async function getLandfill() {
    return fetch(`/api/landfill`, {
        method: 'GET'
    }).then(data => data.json())
}
async function getStsID() {
    return fetch(`/api/sts`, {
        method: 'GET'
    }).then(data => data.json())
}

async function updateCurrentLandfillCapacity(credentials, id) {
    return fetch(`/api/landfill/${id}`, {
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
    const [allVehicles, setAllVehicles] = useState([]);
    const [vehicleFleet, setVehicleFleet] = useState([]);
    const [uniqueVehicle, setUniqueVehicle] = useState(false);


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
            let updateCapacity
            if (isSingleVehicle) {
                updateCapacity = await updateCurrentLandfillCapacity({
                    capacity: Number(volume)
                }, landfillSelected);
            } else {
                updateCapacity = await updateCurrentLandfillCapacity({
                    capacity: (Number(volume) - vehicleFleet[vehicleFleet.length - 1]?.remainingWaste)
                }, landfillSelected);
            }

            if (updateCapacity.success) {
                if (isSingleVehicle) {
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
                    res = await addWce({
                        stsId: stsID,
                        vehicleId: vehicleFleet.map(item => {
                            return { id: item.id, wasteCollect: item.WasteCollect }
                        }).filter(item => item.id != null),
                        landfillId: landfillSelected,
                        volumeCollection: volume,
                        arrivalTime: arrivalTime,
                        departureTime: departureTime,
                        totlaKiloMeter: totlaKiloMeter,
                        insertMany: true
                    });
                }

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
                setAllVehicles(res.vehicles)
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
        async function fetchData() {
            let res = await getStsID();
            if (res.success) {
                setStsLocation([res.sts.latitude, res.sts.longitude])
                setPopupText(res.sts.wardNumber)
                setStsID(res.sts._id)
            }
        }
        if (stsLocation == "") fetchData()
    }, []);


    useEffect(() => {
        async function fetchData() {
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
        fetchData()
    }, []);


    if (add) {
        const VehicleFleet = () => {
            if (uniqueVehicle) data = allVehicles
            else data = [...allVehicles, ...allVehicles, ...allVehicles]
            // let data = [
            //     {
            //         "_id": "6621eb50008b38669df03b5f",
            //         "vehicleId": "112",
            //         "type": "Compactor",
            //         "capacity": 5,
            //         "fuelcostLoaded": 3,
            //         "fuelcostUnloaded": 1,
            //         "isFree": false,
            //         "stsId": {
            //             "_id": "660e00c8d7d1dfc2e850474d",
            //             "wardNumber": 12,
            //             "capacity": 50,
            //             "latitude": 23.225214155047002,
            //             "longitude": 91.31379747394024,
            //             "manager": [
            //                 "660e0003d7d1dfc2e8504714",
            //                 "6611a7974502bd9589ce7523"
            //             ]
            //         },
            //     },
            //     {
            //         "isFree": true,
            //         "_id": "66101864568419c5eb684d8d",
            //         "vehicleId": "46",
            //         "type": "Container Carrier",
            //         "capacity": 7,
            //         "fuelcostLoaded": 9,
            //         "fuelcostUnloaded": 1,
            //     },
            //     {
            //         "isFree": true,
            //         "_id": "66101851568419c5eb684d84",
            //         "vehicleId": "45",
            //         "type": "Compactor",
            //         "capacity": 3,
            //         "fuelcostLoaded": 2,
            //         "fuelcostUnloaded": 1,
            //     },
            //     {
            //         "isFree": true,
            //         "_id": "6610183f568419c5eb684d7b",
            //         "vehicleId": "34",
            //         "type": "Open Truck",
            //         "capacity": 15,
            //         "fuelcostLoaded": 7,
            //         "fuelcostUnloaded": 1,
            //     },
            //     {
            //         "isFree": true,
            //         "_id": "660e00ddd7d1dfc2e8504759",
            //         "vehicleId": "32",
            //         "type": "Dump Truck",
            //         "capacity": 5,
            //         "fuelcostLoaded": 4,
            //         "fuelcostUnloaded": 1,
            //     },
            //     {
            //         "isFree": true,
            //         "_id": "660e00ddd7d1dfc2e8504759",
            //         "vehicleId": "32",
            //         "type": "Dump Truck",
            //         "capacity": 7,
            //         "fuelcostLoaded": 8,
            //         "fuelcostUnloaded": 1,
            //     },
            //     {
            //         "isFree": true,
            //         "_id": "660e00ddd7d1dfc2e8504759",
            //         "vehicleId": "32",
            //         "type": "Dump Truck",
            //         "capacity": 3,
            //         "fuelcostLoaded": 10,
            //         "fuelcostUnloaded": 2,
            //     },
            //     {
            //         "isFree": true,
            //         "_id": "660e00ddd7d1dfc2e8504759",
            //         "vehicleId": "32",
            //         "type": "Dump Truck",
            //         "capacity": 15,
            //         "fuelcostLoaded": 11,
            //         "fuelcostUnloaded": 2,
            //     },
            //     {
            //         "isFree": true,
            //         "_id": "660e00ddd7d1dfc2e8504759",
            //         "vehicleId": "32",
            //         "type": "Dump Truck",
            //         "capacity": 5,
            //         "fuelcostLoaded": 8,
            //         "fuelcostUnloaded": 2,
            //     },
            //     {
            //         "isFree": true,
            //         "_id": "660e00ddd7d1dfc2e8504759",
            //         "vehicleId": "32",
            //         "type": "Dump Truck",
            //         "capacity": 7,
            //         "fuelcostLoaded": 14,
            //         "fuelcostUnloaded": 2,
            //     },
            //     {
            //         "isFree": true,
            //         "_id": "660e00ddd7d1dfc2e8504759",
            //         "vehicleId": "32",
            //         "type": "Dump Truck",
            //         "capacity": 3,
            //         "fuelcostLoaded": 6,
            //         "fuelcostUnloaded": 2,
            //     },
            //     {
            //         "isFree": true,
            //         "_id": "660e00ddd7d1dfc2e8504759",
            //         "vehicleId": "32",
            //         "type": "Dump Truck",
            //         "capacity": 15,
            //         "fuelcostLoaded": 1,
            //         "fuelcostUnloaded": 1,
            //     }
            // ]
            data.forEach(item => {
                let average = (item.fuelcostLoaded / item.capacity).toFixed(2);
                item.average = Number(average);
            });
            data = data.sort(function (item1, item2) {
                return item1.average - item2.average
            })

            //const stsTotalWaste = data[0]?.stsId?.capacity
            const stsTotalWaste = volume
            //const stsTotalWaste = 37

            let editeStsTotalWaste = stsTotalWaste
            let cost = 0
            let vehicleFleetData = []

            data.forEach(item => {
                if (editeStsTotalWaste > 0) {
                    if (editeStsTotalWaste >= item.capacity) {
                        cost += item.fuelcostLoaded
                        editeStsTotalWaste -= item.capacity
                        vehicleFleetData.push({
                            vehicleId: item.vehicleId,
                            type: item.type,
                            capacity: item.capacity,
                            WasteCollect: item.capacity,
                            cost: item.fuelcostLoaded,
                            average: item.average,
                            id: item._id
                        })
                    } else {
                        const costPerKilometer = (item.fuelcostUnloaded + (editeStsTotalWaste / item.capacity) * (item.fuelcostLoaded - item.fuelcostUnloaded))
                        cost += costPerKilometer
                        vehicleFleetData.push({
                            vehicleId: item.vehicleId,
                            type: item.type,
                            capacity: item.capacity,
                            WasteCollect: editeStsTotalWaste,
                            cost: Number(costPerKilometer.toFixed(2)),
                            average: item.average,
                            id: item._id
                        })
                        editeStsTotalWaste = 0
                    }
                }
            });
            vehicleFleetData.push({
                remainingWaste: editeStsTotalWaste,
                totlaCost: Number(cost.toFixed(2))
            })
            setVehicleFleet(vehicleFleetData)
        }

        useEffect(() => {
            VehicleFleet()
        }, [uniqueVehicle, allVehicles])
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex gap-4 flex-wrap md:flex-nowrap h-[90vh] md:h-auto overflow-y-auto">
                <div className="md:min-w-[250px] p-1 w-auto flex flex-col gap-3">
                    <DialogHeader>
                        <DialogTitle>{add ? "Add STS" : "Update"}</DialogTitle>
                    </DialogHeader>

                    <div className="flex gap-2">
                        <div className="grid w-auto items-center gap-1.5">
                            <Label htmlFor="disposed">Volume Collection</Label>
                            <Input onChange={e => setVolume(e.target.value)} value={volume} className="w-full h-9" type="number" placeholder="volume collection" />
                        </div>
                        <div className="grid w-auto items-center gap-1.5">
                            <Label htmlFor="disposed">Totla KiloMeter</Label>
                            <Input onChange={e => setTotlaKiloMeter(e.target.value)} value={totlaKiloMeter} className="w-full h-9 text-blue-500" type="number" placeholder="totla kiloMeter" />
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
                        {add ? <RadioGroup defaultValue={isSingleVehicle ? "Single Vehicle" : "Vehicle Fleet"} className='flex gap-2 mb-1' >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Single Vehicle" id="r1" onClick={e => setIsSingleVehicle(true)} />
                                <Label htmlFor="r1">Single Vehicle</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Vehicle Fleet" id="r2" onClick={e => setIsSingleVehicle(false)} />
                                <Label htmlFor="r2">Vehicle Fleet</Label>
                            </div>
                        </RadioGroup> : ""}

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
                            : <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className='h-9'>Tap to view</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 shadow-2xl border-blue-400">
                                    <div className="grid gap-4">
                                        <div className="flex justify-between text-xs font-bold">
                                            <p>Unique vehicle</p>
                                            <Switch checked={uniqueVehicle} onCheckedChange={() => setUniqueVehicle(pre => !pre)} />
                                        </div>
                                        <div className="flex justify-between text-xs font-extrabold">
                                            <p>Totla vehicle: {vehicleFleet.length - 1}</p>
                                            <p>Remaining waste: {vehicleFleet[Number(vehicleFleet.length - 1)]?.remainingWaste}</p>
                                        </div>
                                        <Table>
                                            <TableHeader className='text-xs p-0'>
                                                <TableRow className='text-xs p-0'>
                                                    <TableHead className="text-center p-2">ID</TableHead>
                                                    <TableHead className="text-center p-2">Type</TableHead>
                                                    <TableHead className="text-center p-2">Waste</TableHead>
                                                    <TableHead className="text-center p-2">Cost</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className='h-3 overflow-y-auto'>
                                                {
                                                    vehicleFleet.map(item => {
                                                        if (item.WasteCollect == null) return
                                                        return <TableRow className='text-xs p-0'>
                                                            <TableCell className="text-center font-medium p-2">{item.vehicleId}</TableCell>
                                                            <TableCell className="text-center p-2">{item.type}</TableCell>
                                                            <TableCell className="text-center p-2">{item.WasteCollect}T</TableCell>
                                                            <TableCell className="text-center p-2">{Math.round(item.cost)} Tk</TableCell>
                                                        </TableRow>
                                                    })
                                                }
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow className='text-xs p-0'>
                                                    <TableCell className="p-2" colSpan={3}>Total Cost</TableCell>
                                                    <TableCell className="text-center p-2">{Math.round(vehicleFleet[Number(vehicleFleet.length - 1)]?.totlaCost)} Tk</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </Table>

                                    </div>
                                </PopoverContent>
                            </Popover>
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
                        <Button onClick={handleSubmit} type="submit" className='w-full' variant="custom" disabled={loading}>
                            {add ? "Add" : "Update"}
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
                        </div></div>
                        }

                        < LeafLetMapRouting
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

