"use client"
import "@/app/globals.css";
import { columns } from "./columns"
import { DataTable } from "@/app/ui/dashboard/users/data-table-user"
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import SelectDropdown from "@/components/select-dropdown";



async function getRole() {
    return fetch(`/api/users/roles`, {
        method: 'GET'
    }).then(data => data.json())
}

async function assignRole(credentials, id) {
    return fetch(`/api/users/${id}/roles`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}


export default function LandfillOperation() {
    const router = useRouter()

    const role = localStorage.getItem('role');
    if (role != "System Admin") {
        router.push('/ui/dashboard');
    } else {
        const queryClient = useQueryClient();
        const [userId, setUserId] = useState("");
        const [roleList, setRoleList] = useState([{ id: null, role: null }]);
        const [selectedRole, setSelectedRole] = useState();
        const [error, setError] = useState("")
        const [loading, setLoading] = useState(false)
        const [open1, setOpen1] = useState(false)


        const handleSubmit = async () => {
            const res = await getRole();
            if (res.success) {
                const newData = res.roles.map((item) => {
                    return {
                        value: item.role,
                        label: item.role
                    }
                })
                setRoleList(newData)
                setError("")
            }
            setError(res.error)
        }

        const handleSubmitForAssignRole = async () => {
            setLoading(true)
            const res = await assignRole({
                role: selectedRole
            }, userId);
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ['users'] })
                setLoading(false)
                setError("")
            }
            setError(res.error)
            setLoading(false)
        }

        const fetchWdeData = async () => {
            return fetch(`/api/users`, {
                method: 'GET'
            }).then(data => data.json()).then(data => {
                const newData = data.users.reverse().map(item => {
                    return {
                        id: item._id,
                        username: item.username,
                        email: item.email,
                        role: item.role,
                    }
                })
                return newData
            })
        };
        const { data, isError, isLoading } = useQuery({
            queryKey: ["users"],
            queryFn: fetchWdeData,
        });

        console.log(data)
        return (
            <div>
                <span className="font-bold text-2xl">User Operation</span>
                <div>
                    {isLoading ?
                        <div className="w-full h-[80vh] flex justify-center items-center">
                            <Loader2 className="ml-2 h-10 w-10 animate-spin" />
                        </div>
                        : <div className="flex flex-col lg:flex-row gap-4 w-full">
                            <div className='flex-1 mt-4 px-8 bg-white rounded-md shadow py-4'>
                                <DataTable columns={columns} data={data} setUserId={setUserId} />
                            </div>
                            <Card className="lg:w-[350px] w-full mt-4 h-fit">
                                <CardHeader>
                                    <CardTitle>Assign Role</CardTitle>
                                </CardHeader>
                                <CardContent className='pb-3'>
                                    <form>
                                        <div onClick={handleSubmit} className="grid w-full items-center gap-4">
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="framework">Select one</Label>
                                                <SelectDropdown
                                                    open={open1}
                                                    setOpen={setOpen1}
                                                    value={selectedRole}
                                                    setValue={setSelectedRole}
                                                    data={roleList}
                                                    selectName="select one">
                                                </SelectDropdown>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>

                                <CardFooter className="flex justify-between pb-3">
                                    <Button className='w-full' variant="custom" onClick={handleSubmitForAssignRole} disabled={loading}>
                                        Assign
                                        {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                                    </Button>
                                </CardFooter>
                                {error != "" ? <p className="text-[11px] bg-red-100 p-0 rounded-md mx-6 mb-3 text-center">{error}</p> : ""}

                            </Card>
                        </div>}
                </div >
            </div>
        )
    }
}
