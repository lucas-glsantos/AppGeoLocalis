import { assets } from "@/assets/assets";
import { useIsMobile } from "@/hooks/useIsMobile";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { PanelLeftClose,  } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardBtn, HomeBtn, LoginBtn, ThemeMode } from "./Buttons";
import WelcomeModal from "./WelcomeModal";

const Navbar = ({ collapsed, onToggle }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const isMobile = useIsMobile();

	// Lógica de alternância contextual
	const isDashboard = location.pathname.startsWith("/dashboard");

	// Logo GeoLocalis
	const LogoGeoLocalis = () => (
		<img 
			onClick={() => navigate("/")}
			className="w-20 cursor-pointer" 
			src={assets.geolocalis} 
			aria-label="Logo GeoLocalis"
			title="GeoLocalis" 
		/>
	);

	return (
		<>
			{/* Topbar */}
			<nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center gap-3">
							{/* Controle do Menu (Mobile) */}
							{isMobile && (
								<button
								className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition min-w-11 min-h-11 flex items-center justify-center"
								aria-label={collapsed ? "Expandir" : "Recolher"}
								title={collapsed ? "Expandir" : "Recolher"}
								onClick={onToggle}
							>
								<PanelLeftClose className={`w-6 h-6 text-gray-600 dark:text-gray-300 transition-transform duration-300 ease-in-out ${collapsed ? "rotate-180" : ""}`} />
							</button>
							)}
							<LogoGeoLocalis />
						</div>

						<div className="flex items-center gap-3">
							<ThemeMode />

							<SignedOut>
								<LoginBtn />
							</SignedOut>

							<SignedIn>
								<div className="flex items-center gap-3">
									{isDashboard 
										? <HomeBtn /> 
										: <DashboardBtn />}
									<UserButton afterSignOutUrl="/login" />
								</div>
							</SignedIn>
						</div>
					</div>
				</div>
			</nav>
			<WelcomeModal />
		</>
	);
};

export default Navbar;