import React, { useEffect, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { BarChart } from '@/components/BarChart';
import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


async function getSts() {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/wce`, {
        method: 'GET'
    }).then(data => data.json())
}


function StsManager() {
    const Data = [{}];
    const [loading, setLoading] = useState(true)
    const [totalKiloMeter, setTotalKiloMeter] = useState(0)
    const [totalTrip, setTotalTrip] = useState(0)
    const [volumeDisposed, setVolumeDisposed] = useState(0)
    const [capecity, setCapecity] = useState(0)

    const [dataTable, setDataTable] = useState(true)
    const [chartData, setChartData] = useState({
        labels: Data?.map((data) => data.year),
        datasets: [
            {
                label: "Users Gained ",
                data: Data?.map((data) => data.userGain),
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0"
                ],
                borderColor: "black",
                borderWidth: 2
            }
        ]
    });


    useEffect(() => {
        async function fetchData() {
            let res = await getSts();
            if (res.success) {

                let sumVolumeDisposed = 0, sumTotalKiloMeter = 0, Capecity = 0;
                res.wce.forEach(obj => {
                    sumVolumeDisposed += obj.volumeCollection
                    sumTotalKiloMeter += obj.totlaKiloMeter
                    Capecity = obj.stsId.capacity
                });
                setVolumeDisposed(sumVolumeDisposed)
                setTotalKiloMeter(sumTotalKiloMeter)
                setTotalTrip(res.wce.length)
                setCapecity(Capecity)

                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const filteredData = res.wce.filter(obj => new Date(obj.createdAt) >= sevenDaysAgo);


                let tableData = filteredData.slice(-5);
                tableData = tableData.map((item) => {
                    return {
                        id: item._id,
                        wardNumber: item.stsId.wardNumber,
                        vehicleId: item.vehicleId.vehicleId,
                        type: item.vehicleId.type,
                        volumeDisposed: item.volumeCollection
                    }
                })
                tableData.reverse()
                setDataTable(tableData)

                const volumeDisposedByDayOfWeek = {};

                filteredData.forEach(obj => {
                    const dayOfWeek = new Date(obj.createdAt).getDay();
                    const dayName = getDayName(dayOfWeek);
                    volumeDisposedByDayOfWeek[dayName] = (volumeDisposedByDayOfWeek[dayName] || 0) + obj.volumeCollection;
                });

                const output = Object.entries(volumeDisposedByDayOfWeek).map(([day, volumeCollection]) => ({
                    day,
                    volumeCollection
                }));

                console.log(output)
                setChartData(
                    {
                        labels: output?.map((data) => data.day),
                        datasets: [
                            {
                                label: "Total waste collection",
                                data: output?.map((data) => data.volumeCollection),
                                backgroundColor: [
                                    "rgba(75,192,192,1)",
                                    "#ecf0f1",
                                    "#50AF95",
                                    "#f3ba2f",
                                    "#2a71d0"
                                ],
                                borderColor: "black",
                                borderWidth: 2
                            }
                        ]
                    }
                )
                setLoading(false)
            }
        }
        fetchData()
    }, []);


    return (
        <>
            <span className="font-bold text-4xl">Dashboard</span>
            <div className="overflow-x-auto" style={{ height: "calc(100vh - 120px)" }}>
                <div className='p-8 pt-4 pb-0 flex flex-col md:flex-row justify-around gap-3'>
                    <Card className="w-[250px] sm:w-[400px] md:w-[450px]">
                        <CardHeader>
                            <CardDescription className='text-center text-black font-medium'>Total Waste Collection</CardDescription>
                        </CardHeader>
                        <CardContent className='flex justify-center'>
                            <CardTitle>{volumeDisposed} T</CardTitle>
                        </CardContent>
                    </Card>
                    <Card className="w-[250px] sm:w-[400px] md:w-[450px]">
                        <CardHeader>
                            <CardDescription className='text-center text-black font-medium'>Current Capacity</CardDescription>
                        </CardHeader>
                        <CardContent className='flex justify-center'>
                            <CardTitle>{capecity} T</CardTitle>
                        </CardContent>
                    </Card>
                    <Card className="w-[250px] sm:w-[400px] md:w-[450px]">
                        <CardHeader>
                            <CardDescription className='text-center text-black font-medium'>Total KiloMeter</CardDescription>
                        </CardHeader>
                        <CardContent className='flex justify-center'>
                            <CardTitle>{totalKiloMeter} KM</CardTitle>
                        </CardContent>
                    </Card>
                    <Card className="w-[250px] sm:w-[400px] md:w-[450px]">
                        <CardHeader>
                            <CardDescription className='text-center text-black font-medium'>Total Trip</CardDescription>
                        </CardHeader>
                        <CardContent className='flex justify-center'>
                            <CardTitle>{totalTrip}</CardTitle>
                        </CardContent>
                    </Card>
                </div>
                <div className="p-8 flex flex-col lg:flex-row gap-4 w-full">
                    <div className='flex-1 h-[400px] bg-white rounded-xl p-4 shadow-md'>
                        <BarChart chartData={chartData} text="Last 7 day's waste collection" />
                    </div>
                    <div className='bg-white rounded-xl p-4 h-[400px] w-[390px] shadow-md overflow-auto'>
                        <Table>
                            <TableCaption>recent entry</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">STS Ward Number</TableHead>
                                    <TableHead>Vehicle Id</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Volume Disposed</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>

                                {
                                    loading ? "" :
                                        dataTable?.map((item) => {
                                            return <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.wardNumber}</TableCell>
                                                <TableCell>{item.vehicleId}</TableCell>
                                                <TableCell>{item.type}</TableCell>
                                                <TableCell>{item.volumeDisposed}</TableCell>
                                            </TableRow>
                                        })
                                }


                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div >
        </>
    )
}

export default StsManager

function getDayName(dayOfWeek) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayOfWeek];
}