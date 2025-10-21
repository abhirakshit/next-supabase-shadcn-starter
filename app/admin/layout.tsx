import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import AdminHeader from "@/components/admin-header";

export default function AdminLayout({
                                                children,
                                            }: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AdminHeader/>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
