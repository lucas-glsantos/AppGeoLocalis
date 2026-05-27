import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, PlusCircle, List, MessageSquare } from "lucide-react";

const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/dashboard/add-post", icon: PlusCircle, label: "Criar Post" },
    { to: "/dashboard/list-post", icon: List, label: "Listar Post" },
    { to: "/dashboard/list-comment", icon: MessageSquare, label: "Comentários" }
];

const linkClass = ({ isActive }) => `
    flex items-center justify-center sm:justify-start gap-3 py-3.5 px-0 sm:px-9 cursor-pointer transition-all duration-200 min-h-[48px]
    ${isActive
        ? "bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500 text-blue-600 dark:text-blue-400"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
    }
`;

const Sidebar = () => (
    <aside className="flex flex-col border-r border-gray-200 dark:border-gray-700 min-h-full pt-2 sm:pt-6 bg-white dark:bg-gray-900 w-16 sm:w-64 transition-all duration-300">
        {navItems.map((item) => (
            <NavLink
                key={item.to}
                end={item.end}
                to={item.to}
                className={linkClass}
                aria-label={item.label}
            >
                <item.icon className="w-5 h-5 min-w-5" />
                <p className="hidden sm:inline-block font-medium">{item.label}</p>
            </NavLink>
        ))}
    </aside>
);

export default Sidebar;
