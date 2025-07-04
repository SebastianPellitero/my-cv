import "./globals.css";
import NavBar from "@/components/NavBar";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <NavBar />
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}
