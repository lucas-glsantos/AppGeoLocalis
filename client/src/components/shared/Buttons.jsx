import { useTheme } from "@/context/theme/ThemeContext";
import { ChevronLeft, House, LayoutDashboard, LogIn, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";


// Back to HomePage Button
export const BackHomeBtn = ({ full }) => {
    const navigate = useNavigate();

    return (
        <button 
            onClick={() => navigate("/")}
            className={`flex items-center gap-2 mb-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 sm:px-6 py-2.5 hover:opacity-90 transition outline-none focus:ring-2 focus:ring-blue-500 min-h-12 ${full ? "w-full justify-center" : ""}`}
            aria-label="Voltar para home"
            title="Voltar"
        >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">
                Voltar
            </span>
        </button>
    )
};

// Home Button
export const HomeBtn = ({ full }) => {
    const navigate = useNavigate();

    return (
	    <button 
            onClick={() => navigate("/")} 
            className={`flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 sm:px-6 py-2.5 hover:opacity-90 transition min-h-12 ${full ? "w-full justify-center" : ""}`}
            aria-label="Voltar para home"
		    title="Home"
        >
            <House className="w-4 h-4" />
            <span className="hidden sm:inline">
			    Voltar
		    </span>
        </button>
    )
};

// Theme toggle Button
export const ThemeMode = () => {
    const { darkMode, ThemeToggle } = useTheme();

    return (
        <button
		    onClick={ThemeToggle}
		    className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition min-w-12 min-h-12 flex items-center justify-center"
		    aria-label={darkMode ? "Modo Claro" : "Modo Escuro"}
		    title={darkMode ? "Modo Claro" : "Modo Escuro"}
	    >
		    {darkMode 
			    ? <Sun className="w-5 h-5 text-yellow-500" /> 
			    : <Moon className="w-5 h-5" />
		    }
	    </button>
    )
};

// Dashboard Button
export const DashboardBtn = ({ full }) => {
    const navigate = useNavigate();
    
    return (
		<button
			onClick={() => navigate("/dashboard")}
			className={`flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 sm:px-6 py-2.5 transition min-h-12 ${full ? "w-full justify-center" : ""}`}
			aria-label="Ir para dashboard"
			title="Dashboard"
		>
			<LayoutDashboard className="w-5 h-5" />
			<span className="hidden sm:inline">
				Dashboard
			</span>
		</button>
	)
};

// Login Button
export const LoginBtn = ({ full }) => {
    const navigate = useNavigate();

    return (
	    <button
		    onClick={() => navigate("/login")}
		    className={`flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 sm:px-6 py-2.5 transition min-h-12 ${full ? "w-full justify-center" : ""}`}
		    aria-label="Fazer login"
		    title="Login"
	    >
		    <LogIn className="w-5 h-5" />
		    <span className="hidden sm:inline">
			    Login
		    </span>
	    </button>
	)
};