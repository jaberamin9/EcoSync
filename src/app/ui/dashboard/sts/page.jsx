"use client"
import "@/app/globals.css";
import { columns } from "./columns"
import { DataTable } from "@/app/ui/dashboard/sts/data-table-sts-with-add"
import { useEffect, useState } from "react";
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
            return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/sts`, {
                method: 'GET'
            }).then(data => data.json()).then(data => {
                const newData = data.sts.map(item => {
                    return {
                        id: item._id,
                        wardNumber: item.wardNumber,
                        capacity: item.capacity,
                        location: [item.latitude, item.longitude],
                        manager: item.manager.map(manager => manager.email),
                    }
                })
                return newData
            })
        };
        const { data, isError, isLoading } = useQuery({
            queryKey: ["stsadmin"],
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
