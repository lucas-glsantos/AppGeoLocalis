import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, List, MessagesSquare, Store, Briefcase, StickyNotePlus, StickyNotes, PanelLeftClose } from "lucide-react";

const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/dashboard/add-post", icon: StickyNotePlus, label: "Criar Post" },
    { to: "/dashboard/list-post", icon: StickyNotes, label: "Meus Posts" },
    { to: "/dashboard/list-comment", icon: MessagesSquare, label: "Comentários" },
    { to: "/dashboard/list-business", icon: Store, label: "Meus Comércios" },
    //{ to: "/dashboard/add-business", icon: Briefcase, label: "Criar Comércio" },
];

const linkClass = ({ isActive }) => `
    flex items-center gap-3 py-3 px-4 cursor-pointer transition-all duration-200 min-h-[48px] rounded-lg
    ${isActive
        ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
    }
`;

const Sidebar = ({ collapsed, onToggle }) => (
    <aside className={`flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 h-screen z-40 transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-64'}`}>
        
        {/* Nav Items */}
        <nav className="flex-1 pt-4 overflow-y-auto space-y-1">
            {navItems.map((item) => (
                <div key={item.to} className="relative group">
                    <NavLink
                        end={item.end}
                        to={item.to}
                        className={linkClass}
                        aria-label={item.label}
                    >
                        <item.icon className="w-5 h-5 min-w-5" />
                        <p className={`${collapsed ? 'hidden' : 'block'} text-sm transition-opacity duration-200`}>
                            {item.label}
                        </p>
                    </NavLink>

                    {collapsed && (
                        <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
                            {item.label}
                        </div>
                    )}
                </div>
            ))}
        </nav>

        {/* Botão Toggle */}
        <div className="p-1 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <button
                onClick={onToggle}
                className={`flex items-center gap-3 w-full py-2.5 text-sm text-blue-600 dark:text-blue-400 hover:text-gray-900 dark:hover:text-white bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:text-blue-400 rounded-lg shadow-md font-semibold transition-all duration-200 cursor-pointer ${collapsed ? 'justify-center px-0' : 'justify-start px-3'}`}
                aria-label={collapsed ? "Expandir Menu" : "Recolher Menu"}
            >
                <PanelLeftClose className={`w-5 h-5 min-w-5 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
                <span className={`${collapsed ? 'hidden' : 'block'} `}>
                    Recolher
                </span>
            </button>
        </div>
    </aside>
);

export default Sidebar;
