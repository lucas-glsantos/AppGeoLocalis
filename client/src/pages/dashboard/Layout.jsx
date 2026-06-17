import { assets } from "../../assets/assets";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useApp } from "../../controllers/AppContext";
import { useTheme } from "../../controllers/ThemeContext";
import { Sun, Moon, House, Menu, PanelLeftClose } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { useState } from "react";

const Layout = () => {
    const { api } = useApp();
    const navigate = useNavigate();
    const { darkMode, ThemeToggle } = useTheme();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">

                        <div className="flex items-center gap-3">

                            <img
                                src={assets.geolocalis}
                                className="w-20 cursor-pointer" 
                            />
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={ThemeToggle}
                                className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                                aria-label={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
                            >
                                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
                            </button>

                            <button 
                                onClick={() => navigate("/")} 
                                className="flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 sm:px-6 py-2.5 hover:opacity-90 transition min-h-[44px]"
                                aria-label="Voltar para home"
                            >
                                <House className="w-4 h-4" />
                                <span className="hidden sm:inline">Voltar</span>
                            </button>
                            <UserButton />

                        </div>
                    </div>
                </div>
            </nav>
            

            <div className="flex flex-1 min-h-0">
                <Sidebar 
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(prev => !prev)}
                />
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
            
        </div>
    );
};

export default Layout;