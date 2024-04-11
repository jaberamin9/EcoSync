"use client"
import "@/app/globals.css";
import { columns } from "./columns"
import { DataTable } from "@/app/ui/dashboard/vehicles/data-table-vehicles-with-add"
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function LandfillOperation() {
    const router = useRouter()

    const role = localStorage.getItem('role');
    if (role != "System Admin") {
        router.push('/ui/dashboard');
    } else {
        const fetchWdeData = async () => {
            return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/vehicles`, {
                method: 'GET'
            }).then(data => data.json()).then(data => {
                const newData = data.vehicles.map(item => {
                    return {
                        id: item._id,
                        vehicleId: item.vehicleId,
                        type: item.type,
                        capacity: item.capacity,
                        fuelcostLoaded: item.fuelcostLoaded,
                        fuelcostUnloaded: item.fuelcostUnloaded,
                        stsWardNumber: item.stsId.wardNumber,
                        stsCapacity: item.stsId.capacity,
                    }
                })
                return newData
            })
        };
        const { data, isError, isLoading } = useQuery({
            queryKey: ["vehicles"],
            queryFn: fetchWdeData,
        });

        return (
            <>
                <span className="font-bold text-4xl">Vehicles Operation</span>
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
