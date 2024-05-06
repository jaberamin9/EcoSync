"use client"
import "@/app/globals.css";
import { columns } from "./columns"
import { DataTable } from "@/app/ui/dashboard/landfill/data-table-with-add"
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
            return fetch(`/api/landfill`, {
                method: 'GET'
            }).then(data => data.json()).then(data => {
                const newData = data.data.reverse().map(item => {
                    return {
                        id: item._id,
                        landfillName: item.landfillName,
                        operationalTimespan: item.operationalTimespan,
                        capacity: item.capacity,
                        location: [item.latitude, item.longitude],
                        manager: item.manager.map((items, idx) => {
                            if ((item.manager.length - 1) == idx) {
                                return items.email
                            } else {
                                return items.email + ", "
                            }
                        }),
                        manager_id: item.manager.map(manager => manager._id),
                    }
                })
                return newData
            })
        };
        const { data, isError, isLoading } = useQuery({
            queryKey: ["landfill"],
            queryFn: fetchWdeData,
        });

        return (
            <>
                <span className="font-bold text-2xl">Landfill Operation</span>
                <div className="">
                    {isLoading ?
                        <div className="w-full h-[80vh] flex justify-center items-center">
                            <Loader2 className="ml-2 h-10 w-10 animate-spin" />
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
