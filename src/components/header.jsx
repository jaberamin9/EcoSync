'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { useSelectedLayoutSegment, useRouter } from 'next/navigation';

import useScroll from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Loader2,
    LogOut,
    User,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProfileDialog } from './profile-dialog';

async function logout() {
    return fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/auth/logout`, {
        method: 'GET'
    }).then(data => data.json())
}

const Header = () => {
    const username = localStorage.getItem('name');
    const scrolled = useScroll(5);
    const selectedLayout = useSelectedLayoutSegment();

    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);

    const handleSubmit = async e => {
        setLoading(true)
        e.preventDefault();

        const res = await logout();
        if (res.success) {
            setLoading(false)
            router.replace("/ui/login");
            window.location.reload();
        }
        setLoading(false)
    }

    return (
        <div
            className={cn(
                `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`,
                {
                    'border-b border-gray-200 bg-white/75 backdrop-blur-lg': scrolled,
                    'border-b border-gray-200 bg-white': selectedLayout,
                },
            )}
        >
            <div className="flex h-[47px] items-center justify-between px-4">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/ui/dashboard"
                        className="flex flex-row space-x-3 items-center justify-center md:hidden"
                    >
                        <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
                        <span className="font-bold text-xl flex ">EcoSync</span>
                    </Link>
                    <div className=' font-bold'>Welcome {username}</div>
                </div>

                <div className="hidden md:block">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => setOpen(true)}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>

                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSubmit}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out </span>
                                {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : ""}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ProfileDialog open={open} setOpen={setOpen}></ProfileDialog>
                </div>
            </div>
        </div>
    );
};

export default Header;
