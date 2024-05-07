import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { BarChart } from '@/components/bar-chart';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


async function getSts() {
    return fetch(`/api/wde`, {
        method: 'GET'
    }).then(data => data.json())
}



function LandfillManager() {

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
                label: "Total waste disposed",
                data: Data?.map((data) => data.userGain),
                backgroundColor: [
                    "#9DBD4C",
                ],
                borderColor: "#9DBD4C",
                borderWidth: 2
            }
        ]
    });


    useEffect(() => {
        async function fetchData() {
            let res = await getSts();
            if (res.success) {
                let sumVolumeDisposed = 0, sumTotalKiloMeter = 0, Capecity = 0;
                res.wde.forEach(obj => {
                    sumVolumeDisposed += obj.volumeDisposed
                    sumTotalKiloMeter += obj.totlaKiloMeter
                    Capecity = obj.landfillId.capacity
                });
                setVolumeDisposed(sumVolumeDisposed)
                setTotalKiloMeter(sumTotalKiloMeter)
                setTotalTrip(res.wde.length)
                setCapecity(Capecity)

                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const filteredData = res.wde.filter(obj => new Date(obj.createdAt) >= sevenDaysAgo);

                let tableData = filteredData.slice(-8);
                tableData = tableData.map((item) => {
                    return {
                        id: item._id,
                        wardNumber: item.stsId.wardNumber,
                        vehicleId: item.vehicleId.vehicleId,
                        type: item.vehicleId.type,
                        volumeDisposed: item.volumeDisposed
                    }
                })
                tableData.reverse()
                setDataTable(tableData)

                const volumeDisposedByDayOfWeek = {};

                filteredData.forEach(obj => {
                    const dayOfWeek = new Date(obj.createdAt).getDay();
                    const dayName = getDayName(dayOfWeek);
                    volumeDisposedByDayOfWeek[dayName] = (volumeDisposedByDayOfWeek[dayName] || 0) + obj.volumeDisposed;
                });

                let output = Object.entries(volumeDisposedByDayOfWeek).map(([day, volumeDisposed]) => ({
                    day,
                    volumeDisposed
                }));

                const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                const result = daysOfWeek.map(day => {
                    const existingData = output.find(item => item.day === day);
                    return existingData ? existingData : { volumeDisposed: 0, day };
                });
                output = result;

                setChartData(
                    {
                        labels: output?.map((data) => data.day),
                        datasets: [
                            {
                                label: "Total waste disposed",
                                data: output?.map((data) => data.volumeDisposed),
                                backgroundColor: [
                                    "#9DBD4C",
                                ],
                                borderColor: "#9DBD4C",
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
            <span className="font-bold text-2xl">Dashboard</span>
            <div className="overflow-x-auto">
                <div className='pt-4 pb-8 flex flex-col md:flex-row justify-around gap-3'>
                    <diV className="bg-green-200 px-4 py-8 flex-1 flex flex-col gap-4 justify-center items-center rounded-md shadow-md">
                        <span className='text-sm text-center text-black font-medium'>Total Waste Disposed</span>
                        <span className='text-2xl font-semibold leading-none tracking-tight'>{volumeDisposed} T</span>
                    </diV>
                    <diV className="bg-orange-200 px-4 py-8 flex-1 flex flex-col gap-4 justify-center items-center rounded-md shadow-md">
                        <span className='text-sm text-center text-black font-medium'>Current Capacity</span>
                        <span className='text-2xl font-semibold leading-none tracking-tight'>{capecity} T</span>
                    </diV>
                    <diV className="bg-red-200 px-4 py-8 flex-1 flex flex-col gap-4 justify-center items-center rounded-md shadow-md">
                        <span className='text-sm text-center text-black font-medium'>Total KiloMeter</span>
                        <span className='text-2xl font-semibold leading-none tracking-tight'>{totalKiloMeter.toFixed(2)} KM</span>
                    </diV>
                    <diV className="bg-blue-200 px-4 py-8 flex-1 flex flex-col gap-4 justify-center items-center rounded-md shadow-md">
                        <span className='text-sm text-center text-black font-medium'>Total Trip</span>
                        <span className='text-2xl font-semibold leading-none tracking-tight'>{totalTrip}</span>
                    </diV>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 w-full flex-wrap  pb-2">
                    <div className='flex-1 h-[400px] bg-white rounded-xl p-4 shadow-md'>
                        <BarChart chartData={chartData} text="Last 7 day's waste disposed" />
                    </div>
                    <div className='flex-1 bg-white rounded-xl p-4 h-[400px] shadow-md overflow-hidden'>
                        <div className='w-full text-center pb-2 font-semibold'>Recent Entry</div>
                        <div className='h-[340px]'>
                            <Table className='table-fixed'>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Ward Number</TableHead>
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
                                                    <TableCell>{item.volumeDisposed}T</TableCell>
                                                </TableRow>
                                            })
                                    }


                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default LandfillManager

function getDayName(dayOfWeek) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
}