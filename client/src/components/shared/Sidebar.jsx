import { NavLink } from "react-router-dom";
import {  PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

export const linkClass = ({ isActive }) => `
    flex items-center gap-3 py-3 px-4 cursor-pointer transition-all duration-200 min-h-[48px] rounded-lg border-l-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
    ${
		isActive
			? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold"
			: "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
	}
`;

const Sidebar = ({ collapsed, onToggle, items = [], children, overlay = false }) => {
	const isMobile = useIsMobile();

	return (
		<aside
			className={`
				flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out z-40
				${overlay
					// MODO OVERLAY: sempre fixed, esconde/mostra com translate
					? `fixed top-16 left-0 h-[calc(100vh-64px)] w-64 
						${collapsed 
							? '-translate-x-full opacity-0 pointer-events-none' 
							: 'translate-x-0 opacity-100'}`
					// MODO PAINEL: sticky em desktop, overlay em mobile
					: `${isMobile 
						? `fixed inset-0 top-16 w-full ${collapsed ? "-translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"}` 
						: `sticky top-16 h-[calc(100vh-64px)] ${collapsed ? "w-16" : "w-64"}`
					}`
				}
			`}
		>
			{/* Nav Items */}
			<nav className={`flex-1 overflow-y-auto space-y-1 ${isMobile ? "pt-2 px-2" : "pt-4"}`}>
				{/* Mapeia os itens dinâmicos passados via prop */}
				{items.map((item) => (
					<div key={item.to} className="relative group">
						<NavLink 
							end={item.end} 
							to={item.to} 
							className={linkClass} 
							aria-label={item.label}
							onClick={() => isMobile && onToggle()}
						>
							<item.icon className="w-5 h-5 min-w-5" />
							<span className={`${collapsed && !isMobile && !overlay ? "hidden" : "block"} text-sm transition-opacity duration-300`}>
								{item.label}
							</span>
						</NavLink>

						{collapsed && !isMobile && !overlay && (
							<div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
								{item.label}
							</div>
						)}
					</div>
				))}

				{/* Renderiza botões customizados passados como children */}
				{children}

			</nav>

			{/* Botão de Recolher */}
			{!overlay && (
				<div className="p-1 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
					<button
						className={`flex items-center gap-3 w-full min-h-[48px] text-sm text-blue-600 dark:text-blue-400 hover:text-gray-900 dark:hover:text-white bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-lg shadow-md font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${collapsed ? "justify-center px-0" : "justify-start px-3"}`}
						aria-label={collapsed ? "Expandir" : "Recolher"}
						aria-expanded={!collapsed}
						title={collapsed ? "Expandir" : "Recolher"}
						onClick={onToggle}
					>
						{collapsed
							? <PanelLeftOpen className="w-5 h-5 min-w-5 transition-opacity duration-200" />
							: <PanelLeftClose className="w-5 h-5 min-w-5 transition-opacity duration-200" />
						}
						
						<span className={`${collapsed ? "hidden" : "block"}`}>
							Recolher
						</span>
					</button>
				</div>
			)}
		</aside>
	);
};

export default Sidebar;
