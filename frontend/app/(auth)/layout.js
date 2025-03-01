import AppSidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import TokenRefresher from "@/components/TokenRefresher";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AuthLayout({ children }) {
    return (
        <SidebarProvider>
            <TokenRefresher />
            <div className="flex h-screen w-screen overflow-hidden">
                <AppSidebar />
                <main className="flex flex-col h-full w-full overflow-hidden">
                    <Navbar />
                    <div className="flex-1 overflow-hidden overflow-y-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}