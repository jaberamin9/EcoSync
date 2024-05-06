"use client"
import "@/app/globals.css";
import { columns } from "./columns"
import { DataTable } from "@/app/ui/dashboard/rbac/data-table-role-with-add"
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
            return fetch(`/api/rbac/roles`, {
                method: 'GET'
            }).then(data => data.json()).then(data => {
                const newData = data.roles.reverse().map(item => {
                    return {
                        id: item._id,
                        roles: item.role,
                        permissions: item.permissions.map((items, idx) => {
                            if ((item.permissions.length - 1) == idx) {
                                return items.permissionsName
                            } else {
                                return items.permissionsName + ", "
                            }
                        }),
                    }
                })
                return newData
            })
        };
        const { data, isError, isLoading } = useQuery({
            queryKey: ["rbac"],
            queryFn: fetchWdeData,
        });

        return (
            <>
                <span className="font-bold text-4xl">Role-Based Access Control</span>
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
