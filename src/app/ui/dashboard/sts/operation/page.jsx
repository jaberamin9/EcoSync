"use client"
import "@/app/globals.css";
import { columns } from "./columns"
import { DataTable } from "@/app/ui/dashboard/sts/operation/data-table-sts"
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";


export default function page() {
    const router = useRouter()

    const role = localStorage.getItem('role');
    if (role == "Landfill Manager") {
        router.push('/ui/dashboard');
    } else {
        const fetchWdeData = async () => {
            return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/wce`, {
                method: 'GET'
            }).then(data => data.json()).then(data => {
                const newData = data.wce.map(item => {
                    return {
                        id: item._id,
                        stsId: item.stsId._id,
                        landfill_id: item.landfillId._id,
                        landfillName: item.landfillId.landfillName,
                        landfillCapacity: item.landfillId.capacity,
                        location: [item.landfillId.latitude, item.landfillId.longitude],
                        stsLocation: [item.stsId.latitude, item.stsId.longitude],
                        totlaKiloMeter: item.totlaKiloMeter,
                        volumeCollection: item.volumeCollection,
                        arrivalTime: item.arrivalTime,
                        departureTime: item.departureTime,
                        vehicleId: item.vehicleId.vehicleId,
                        vehicle_id: item.vehicleId._id,
                        vehicleType: item.vehicleId.type,
                        vehicleCapacity: item.vehicleId.capacity,
                        fuelcostLoaded: item.vehicleId.fuelcostLoaded,
                        fuelcostLoaded: item.vehicleId.fuelcostLoaded,
                    }
                })
                return newData
            })
        };
        const { data, isError, isLoading } = useQuery({
            queryKey: ["wcemeneger"],
            queryFn: fetchWdeData,
        });

        return (
            <>
                <span className="font-bold text-4xl">Secondary Transfer Stations Operation</span>
                <div className="overflow-x-auto" style={{ height: "calc(100vh - 120px)" }}>
                    {isLoading ?
                        <div className="w-full h-full flex justify-center items-center">
                            <Loader2 className="ml-2 h-10 w-10 animate-spin" />
                        </div>
                        : <div className="p-8">
                            <DataTable columns={columns} data={data} />
                        </div>
                    }
                </div >
            </>
        )
    }
}
