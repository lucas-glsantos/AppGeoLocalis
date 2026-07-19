import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { BarChart3, Store, MessagesSquare, StickyNotes, StickyNotePlus, LayoutDashboard } from "lucide-react";
// import { UserButton } from "@clerk/clerk-react";
// import { assets } from "../../assets/assets";


// Array de Rotas Dashboard
const dashNavItems = [
	{ to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
	{ to: "/dashboard/add-post", icon: StickyNotePlus, label: "Criar Post" },
	{ to: "/dashboard/list-post", icon: StickyNotes, label: "Meus Posts" },
	{ to: "/dashboard/list-comment", icon: MessagesSquare, label: "Comentários" },
	{ to: "/dashboard/list-business", icon: Store, label: "Meus Comércios" },
	{ to: "/dashboard/metrics", icon: BarChart3, label: "Métricas" },
	//{ to: "/dashboard/add-business", icon: Briefcase, label: "Criar Comércio" },
];

const Layout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
                    items={dashNavItems}
                    overlay={false}
                />

                {/* Content Container */}
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;