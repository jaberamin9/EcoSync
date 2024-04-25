import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "EcoSync",
    description: "Aiming to address waste management challenges in urban areas, EcoSync, a web application, is introduced by the local municipal authority.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html >
    );
}