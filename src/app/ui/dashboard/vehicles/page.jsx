"use client"
import "@/app/globals.css";
import { columns } from "./columns"
import { DataTable } from "@/app/ui/dashboard/vehicles/data-table-vehicles-with-add"
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";


export default function LandfillOperation() {
    const router = useRouter()

    const role = localStorage.getItem('role');
    if (role != "System Admin") {
        router.push('/ui/dashboard');
    } else {
        const fetchWdeData = async () => {
            return fetch(`/api/vehicles`, {
                method: 'GET'
            }).then(data => data.json()).then(data => {
                const newData = data.vehicles.reverse().map(item => {
                    return {
                        id: item._id,
                        vehicleId: item.vehicleId,
                        type: item.type,
                        capacity: item.capacity,
                        fuelcostLoaded: item.fuelcostLoaded,
                        fuelcostUnloaded: item.fuelcostUnloaded,
                        sts_id: item.stsId._id,
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
                <span className="font-bold text-2xl">Vehicles Operation</span>
                <div className="">
                    {isLoading ?
                        <div className="w-full h-full flex justify-center items-center">
                            <Loader2 className="ml-2 h-[80vh] w-10 animate-spin" />
                        </div>
                        : <div className="mt-4 px-8 bg-white rounded-md shadow py-4">
                            <DataTable columns={columns} data={data} />
                        </div>
                    }
                </div >
            </>
        )
    }
}
