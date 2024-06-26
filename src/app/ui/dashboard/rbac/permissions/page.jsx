"use client"
import "@/app/globals.css";
import { columns } from "./columns"
import { DataTable } from "@/app/ui/dashboard/rbac/permissions/data-permissions-role-with-add"
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";


export default function RbacOperation() {
    const router = useRouter()

    const role = localStorage.getItem('role');
    if (role != "System Admin") {
        router.push('/ui/dashboard');
    } else {
        const fetchWdeData = async () => {
            return fetch(`/api/rbac/permissions`, {
                method: 'GET'
            }).then(data => data.json()).then(data => {
                const newData = data.data.reverse().map(item => {
                    return {
                        id: item._id,
                        permissionsName: item.permissionsName,
                        permissionsValue: item.permissionsValue.map((items, idx) => {
                            if ((item.permissionsValue.length - 1) == idx) {
                                return items
                            } else {
                                return items + ", "
                            }
                        }),
                    }
                })
                return newData
            })
        };
        const { data, isError, isLoading } = useQuery({
            queryKey: ["permissions"],
            queryFn: fetchWdeData,
        });

        return (
            <div>
                <span className="font-bold text-2xl">Role-Based Access Control</span>
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
