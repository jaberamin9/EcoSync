"use client"

import '@/app/globals.css'
import MarginWidthWrapper from "@/components/margin-width-wrapper";
import SideNav from '@/components/side-nav';
import Header from "@/components/header";
import HeaderMobile from "@/components/header-mobile";
import PageWrapper from "@/components/page-wrapper";


export default function RootLayout({ children }) {
    return (
        <div className="flex">
            <SideNav />
            <main className="flex-1 w-full">
                <MarginWidthWrapper>
                    <Header />
                    <HeaderMobile />
                    <PageWrapper>{children}</PageWrapper>
                </MarginWidthWrapper>
            </main>
        </div>
    );
}