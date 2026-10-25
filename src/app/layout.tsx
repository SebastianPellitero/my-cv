import "./globals.css";
import NavBar from "@/components/NavBar";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { DM_Mono, DM_Serif_Display } from "next/font/google";

const dmMono = DM_Mono({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-dm-mono" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-dm-serif" });

const description = "Senior Frontend Developer — React, TypeScript, Next.js. 9+ years building accessible, fast web apps.";

export const metadata: Metadata = {
    metadataBase: new URL("https://sebastianpellitero.dev"),
    title: {
        default: "Sebastian Pellitero",
        template: "%s — Sebastian Pellitero",
    },
    description,
    openGraph: {
        type: "website",
        siteName: "Sebastian Pellitero",
        title: "Sebastian Pellitero",
        description,
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={`${dmMono.variable} ${dmSerif.variable}`}>
            <body className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
                <div className="pointer-events-none fixed inset-0 -z-10 opacity-60
                  [background:radial-gradient(800px_circle_at_20%_10%,rgba(99,102,241,0.12),transparent_45%),radial-gradient(900px_circle_at_80%_20%,rgba(16,185,129,0.10),transparent_50%)]" />
                <NavBar />
                <main>
                    {children}
                </main>
                <Analytics />
            </body>
        </html>
    );
}
