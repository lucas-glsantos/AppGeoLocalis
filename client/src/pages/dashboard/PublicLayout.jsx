import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { LayoutDashboard, Settings, Store } from "lucide-react";
import { useState } from "react"

export const mainNavItems = [
	{ to: "/dashboard", icon: LayoutDashboard, label: "Dasboard", end: true },
	{ to: "/nearby", icon: Store, label: "Comércios Próximos" },
	{ to: "/settings", icon: Settings, label: "Configurações" },
];

const PublicLayout = ({ children, items = mainNavItems }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Inicia Fechado
    const handleToggle = () => setSidebarCollapsed(prev => !prev);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Topbar */}
            <Navbar
                collapsed={sidebarCollapsed}
                onToggle={handleToggle}
            />

            {/* Sidebar */}
            <div className="flex flex-1 min-h-0">
                <Sidebar 
                    collapsed={sidebarCollapsed}
                    onToggle={handleToggle}
                    items={items}
                    overlay={true}
                />
                {/* Backdrop para Mobile */}
                {!sidebarCollapsed && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-30"
                        onClick={() => setSidebarCollapsed(false)}
                    />
                )}
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default PublicLayout;