import { ReactNode } from 'react';
import '@/app/globals.css'
export default function MarginWidthWrapper({
    children,
}) {
    return (
        <div className=" flex flex-col md:ml-60 sm:border-r sm:border-zinc-700 min-h-screen" style={{ width: "calc(100vw - 240px)" }}>
            {children}
        </div>
    );
}
