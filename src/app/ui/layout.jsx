"use client"
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function RootLayout({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            <div >{children}</div>
            <Toaster />
        </QueryClientProvider>
    );
}