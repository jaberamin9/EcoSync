import { ReactNode } from 'react';

export default function MarginWidthWrapper({ children }) {
    return (
        <div className="md:w-calc w-screen flex flex-col md:ml-60 sm:border-r sm:border-zinc-700 min-h-screen" >
            {children}
        </div>
    );
}
