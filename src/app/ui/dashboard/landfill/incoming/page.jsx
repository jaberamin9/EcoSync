"use client"
import "@/app/globals.css";
import { columns } from "./columns"
import { DataTable } from "../arrived/data-table"
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";


export default function DemoPage() {
    const router = useRouter()

    const role = localStorage.getItem('role');
    if (role == "STS Manager") {
        router.push('/ui/dashboard');
    } else {
        const fetchWdeData = async () => {
            return fetch(`/api/wce`, {
                method: 'GET'
            }).then(data => data.json()).then(data => {

                const newData = data.data.reverse().map(item => {
                    return {
                        id: item._id,
                        sts: item.stsId.wardNumber,
                        vehicleId: item.vehicleId.vehicleId,
                        vehicleType: item.vehicleId.type,
                        volumeCollection: item.volumeCollection,
                        arrivalTime: item.arrivalTime,
                        departureTime: item.departureTime,
                        vehicle_id: item.vehicleId._id,
                        sts_id: item.stsId._id,
                        landfill_id: item.landfillId._id,
                        landfill_capacity: item.landfillId.capacity,
                        wardNumber: item.stsId.wardNumber,
                        running: item.running,
                        totlaKiloMeter: item.totlaKiloMeter
                    }
                })
                return newData
            })
        };
        const { data, isError, isLoading } = useQuery({
            queryKey: ["insertWde"],
            queryFn: fetchWdeData,
        });

        return (
            <div>
                <span className="font-bold text-2xl">Incoming</span>
                <div>
                    {isLoading ?
                        <div className="w-full h-[80vh] flex justify-center items-center">
                            <Loader2 className="ml-2 h-10 w-10 animate-spin" />
                        </div>
                        : <div className="mt-4 px-8 bg-white rounded-md shadow py-4">
                            <DataTable columns={columns} data={data} />
                        </div>
                    }
                </div >
            </div>
        )
    }
}
