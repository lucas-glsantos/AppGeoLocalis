import { assets } from "@/assets/assets";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useTheme } from "@/context/theme/ThemeContext";
import { Sun, Moon, LayoutDashboard, LogIn, PanelLeftClose, House } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/useIsMobile";


const Navbar = ({ collapsed, onToggle }) => {
	const { darkMode, ThemeToggle } = useTheme();
	const navigate = useNavigate();
	const location = useLocation();
	const isMobile = useIsMobile();

	// Lógica de alterância contextual
	const isDashboard = location.pathname.startsWith("/dashboard");

	// Theme Toggle
	const ThemeMode = () => (
		<button
			onClick={ThemeToggle}
			className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
			aria-label={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
			title={darkMode ? "Modo Claro" : "Modo Escuro"}
		>
			{darkMode 
				? <Sun className="w-5 h-5 text-yellow-500" /> 
				: <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
			}
		</button>
	);

	// Responsive botton Home
	const HomeBtn = ({ full }) => (
		<button 
        	onClick={() => navigate("/")} 
        	className={`flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 sm:px-6 py-2.5 hover:opacity-90 transition min-h-[44px] ${full ? "w-full justify-center" : ""}`}
        	aria-label="Voltar para home"
			title="Home"
    	>
        	<House className="w-4 h-4" />
        	<span className="hidden sm:inline">
				Voltar
			</span>
    	</button>
	);

	// Responsive botton Dashboard
	const DashboardBtn = ({ full }) => (
		<button
			onClick={() => navigate("/dashboard")}
			className={`flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 sm:px-6 py-2.5 transition min-h-[44px] ${full ? "w-full justify-center" : ""}`}
			aria-label="Ir para dashboard"
			title="Dashboard"
		>
			<LayoutDashboard className="w-5 h-5" />
			<span className="hidden sm:inline">
				Dashboard
			</span>
		</button>
	);

	// Responsive botton Login
	const LoginBtn = ({ full }) => (
		<button
			onClick={() => navigate("/login")}
			className={`flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 sm:px-6 py-2.5 transition-colors min-h-[44px] ${full ? "w-full justify-center" : ""}`}
			aria-label="Fazer login"
			title="Login"
		>
			<LogIn className="w-5 h-5" />
			<span className="hidden sm:inline">
				Login
			</span>
		</button>
	);

	return (
		<>
			{/* Topbar */}
			<nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center gap-3">
							{/* Controle do Menu (Mobile) */}
							{isMobile && (
								<button
								className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
								aria-label={collapsed ? "Expandir" : "Recolher"}
								title={collapsed ? "Expandir" : "Recolher"}
								onClick={onToggle}
							>
								<PanelLeftClose className={`w-6 h-6 text-gray-600 dark:text-gray-300 transition-transform duration-300 ease-in-out ${collapsed ? "rotate-180" : ""}`} />
							</button>
							)}
							<img 
								onClick={() => navigate("/")} 
								src={assets.geolocalis} 
								alt="logo" 
								className="w-20 cursor-pointer" 
							/>
						</div>

						<div className="flex items-center gap-3">
							<ThemeMode />

							<SignedOut><LoginBtn /></SignedOut>

							<SignedIn>
								<div className="flex items-center gap-3">
									{isDashboard ? <HomeBtn /> : <DashboardBtn />}
									<UserButton afterSignOutUrl="/" />
								</div>
							</SignedIn>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Navbar;