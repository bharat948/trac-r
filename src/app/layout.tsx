import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { ToastProvider } from "@/components/common/Toast";

import { getTrackers } from "@/app/actions/trackers";

export const metadata: Metadata = {
    title: "Expense Tracker",
    description: "Track your expenses easily",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const trackers = await getTrackers();

    return (
        <html lang="en">
            <body className="antialiased">
                <ToastProvider>
                    <ClientLayout trackers={trackers}>
                        {children}
                    </ClientLayout>
                </ToastProvider>
            </body>
        </html>
    );
}
