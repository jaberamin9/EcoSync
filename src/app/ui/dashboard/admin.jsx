import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { BarChart } from '@/components/bar-chart';
import { useQuery } from "@tanstack/react-query";
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
    return fetch(`/api/wce`, {
        method: 'GET'
    }).then(data => data.json())
}


function Admin() {
    const Data = [{}];
    const [loading, setLoading] = useState(true)
    const [totalKiloMeter, setTotalKiloMeter] = useState(0)
    const [totalTrip, setTotalTrip] = useState(0)
    const [volumeCollection, setVolumeCollection] = useState(0)

    const [dataTable, setDataTable] = useState(true)
    const [chartData, setChartData] = useState({
        labels: Data.map((data) => data.year),
        datasets: [
            {
                label: "Users Gained ",
                data: Data.map((data) => data.userGain),
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

    const fetchWdeData = async () => {
        return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/wce?pre=7`, {
            method: 'GET'
        }).then(data => data.json())
    };

    const { data, isError, isLoading } = useQuery({
        queryKey: ["totalwaste"],
        queryFn: fetchWdeData,
    });

    useEffect(() => {
        if (!isLoading) {
            setChartData(
                {
                    labels: data.result.map((data) => data.day),
                    datasets: [
                        {
                            label: "Total waste collection",
                            data: data.result.map((data) => data.volumeCollection),
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
        }
    }, [isLoading])


    useEffect(() => {
        async function fetchData() {
            let res = await getSts();
            if (res.success) {
                res.wce.map((item, idx) => {
                    setTotalKiloMeter((pev) => pev + item.totlaKiloMeter)
                    setVolumeCollection((pev) => pev + item.volumeCollection)
                    return
                })
                setTotalTrip(res.wce.length)


                let newData = res.wce.slice(-8);
                newData = newData.map((item, idx) => {
                    return {
                        id: item._id,
                        wardNumber: item.stsId?.wardNumber,
                        landfillName: item.landfillId?.landfillName,
                        volumeCollection: item.volumeCollection
                    }
                })
                newData.reverse()
                setDataTable(newData)
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
                        <span className='text-sm text-center text-black font-medium'>Total Waste Collection</span>
                        <span className='text-2xl font-semibold leading-none tracking-tight'>{volumeCollection} T</span>
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
                <div className="flex flex-col lg:flex-row gap-4 w-full flex-wrap">
                    <div className='flex-1 h-[400px] bg-white rounded-xl p-4 shadow-md'>
                        <BarChart chartData={chartData} text="Last 7 day's waste collection" />
                    </div>
                    <div className='flex-1 bg-white rounded-xl p-4 h-[400px] shadow-md overflow-hidden'>
                        <div className='w-full text-center pb-2 font-semibold'>Recent Entry</div>
                        <div className='h-[340px]'>
                            <Table className='table-fixed'>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>STS Ward</TableHead>
                                        <TableHead>Waste</TableHead>
                                        <TableHead>Landfill Name</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        loading ? "" :
                                            dataTable.map((item) => {
                                                return <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.wardNumber}</TableCell>
                                                    <TableCell>{item.volumeCollection}T</TableCell>
                                                    <TableCell>{item.landfillName}</TableCell>
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

export default Admin