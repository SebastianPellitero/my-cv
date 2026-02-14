import CanvasBackground from "@/components/canvasBackground";
import "./globals.css";
import NavBar from "@/components/NavBar";
import CanvasVectorBackground from "@/components/canvasVectorBackground";
import { Analytics } from "@vercel/analytics/next"


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
                <div className="pointer-events-none fixed inset-0 -z-10 opacity-60
                  [background:radial-gradient(800px_circle_at_20%_10%,rgba(99,102,241,0.12),transparent_45%),radial-gradient(900px_circle_at_80%_20%,rgba(16,185,129,0.10),transparent_50%)]" />
                <NavBar />
                {/* <CanvasBackground /> */}
                <main>
                    {children}
                </main>
                <Analytics />
            </body>
        </html>
    );
}
