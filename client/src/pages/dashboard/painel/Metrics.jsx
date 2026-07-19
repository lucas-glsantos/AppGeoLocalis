import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "@/controllers/AppContext";
import { Eye, MousePointerClick, PhoneCall, TrendingUp, Store, Loader2, BarChart3, Info } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Metrics = () => {
	const { api } = useApp();
	const [metrics, setMetrics] = useState(null);

	const [isLoading, setIsLoading] = useState(true);
	const cancelledRef = useRef(false);
	const abortControllerRef = useRef(null);
	const navigate = useNavigate();

	// Função Buscar Índices e Métricas de Business
	const fetchMetrics = useCallback(async (signal) => {
		try {
			setIsLoading(true);

			const { data } = await api.get("/api/metrics/dashboard", { signal });

			if (cancelledRef.current) return;

			if (data.success) {
				setMetrics(data.metrics);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			if (error.name === 'CanceledError') return;
			toast.error(error.response?.data?.message || error.message);
		} finally {
			setIsLoading(false);
		}
	}, [api]);

	useEffect(() => {
		cancelledRef.current = false;
		abortControllerRef.current = new AbortController();

		fetchMetrics(abortControllerRef.current.signal);

		return () => {
			cancelledRef.current = true;
			abortControllerRef.current?.abort();
		};
	}, [fetchMetrics]);

	// Lógica para pluralização precisa
	const businessCount = metrics?.topBusinesses?.length || 0;

	// Classes padronizadas
	const cardClass = "flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700";
	const iconWrapperClass = "w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900";
	const iconInfoClass = "w-8 h-8 flex items-center justify-between rounded-full bg-gray-50 dark:bg-gray-900";
	const iconClass = "w-5 h-5";

	return (
		<div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-center justify-center gap-3 mb-6">
					<BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
					<h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
						Métricas do seu Comércio
					</h1>
					<span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
						{businessCount} comércio
					</span>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="w-8 h-8 text-gray-400 animate-spin" aria-label="Carregando métricas..." />
					</div>
				) : !businessCount ? (
					/* Empty State */
					<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg border border-gray-300 dark:border-gray-700">
						<BarChart3 className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" aria-hidden="true" />
						<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
							Nenhum dado disponível
						</h2>
						<p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-6">
							Cadastre seu comércio e gerencie seu Impacto Social!
						</p>

						<div className="flex gap-3 justify-center">
							<button
								onClick={() => navigate("/dashboard/add-business")}
								className="w-auto p-4 sm:px-6 sm:py-4 border border-gray-800 dark:border-gray-400 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
								title="Cadastar Comércio"
								aria-label="Cadastrar Comércio"
							>
								<Store className="w-4 h-4" />
								Cadastrar
							</button>
						</div>
					</div>
				) : (
					<>
						{/* Cards resumo */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
							<div className={cardClass}>
								<div className={iconWrapperClass}>
									<Eye className={`${iconClass} text-blue-500`} />
								</div>
								<div>
									<p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalViews}</p>
									<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Visualizações
									</p>
								</div>
								<div className={iconInfoClass}>
									<Info className={`${iconClass} text-gray-500`} />
								</div>
							</div>

							<div className={cardClass}>
								<div className={iconWrapperClass}>
									<MousePointerClick className={`${iconClass} text-green-500`} />
								</div>
								<div>
									<p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalClicks}</p>
									<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Cliques no WhatsApp
									</p>
								</div>
							</div>

							<div className={cardClass}>
								<div className={iconWrapperClass}>
									<PhoneCall className={`${iconClass} text-purple-500`} />
								</div>
								<div>
									<p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalContacts}</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Contatos
									</p>
								</div>
							</div>

							<div className={cardClass}>
								<div className={iconWrapperClass}>
									<TrendingUp className={`${iconClass} ${metrics.monthlyIncrease >= 0 ? "text-green-500" : "text-red-500"}`} />
								</div>
								<div>
									<p className={`text-2xl font-bold ${metrics.monthlyIncrease >= 0 ? "text-green-500" : "text-red-500"}`}>
										{metrics.monthlyIncrease >= 0 ? "+" : ""}{metrics.monthlyIncrease}%
									</p>
									<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Aumento Mensal
									</p>
								</div>
							</div>
						</div>

						{/* Comparativo mês atual vs anterior */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 p-6 sm:p-8 mb-8">
							<h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
								Comparativo Mensal
							</h2>
							<div className="flex items-end gap-8 h-32" aria-label="Gráfico de barras de comparativo mensal">
								<div className="flex flex-col items-center w-24">
									<span className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{metrics.comparison.previousMonth}</span>
									<div
										className="w-full bg-gray-300 dark:bg-gray-600 rounded-t-md transition-all duration-500"
										style={{ height: `${Math.max((metrics.comparison.previousMonth / Math.max(metrics.comparison.currentMonth, metrics.comparison.previousMonth, 1)) * 100, 5)}%` }}
									/>
									<span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">
										Mês Anterior
									</span>
								</div>
								<div className="flex flex-col items-center w-24">
									<span className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{metrics.comparison.currentMonth}</span>
									<div
										className="w-full bg-blue-500 rounded-t-md transition-all duration-500"
										style={{ height: `${Math.max((metrics.comparison.currentMonth / Math.max(metrics.comparison.previousMonth, metrics.comparison.currentMonth, 1)) * 100, 5)}%` }}
									/>
									<span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">
										Mês Atual
									</span>
								</div>
							</div>
						</div>

						{/* Tabela de Comércios (Desktop View) */}
						<div className="hidden md:block relative w-full overflow-x-auto scrollbar-hide bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
							<div className="p-6 border-b border-gray-200 dark:border-gray-700">
								<h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
									<Store className="w-5 h-5" /> 
									Desempenho
								</h2>
							</div>
							<table className="w-full text-sm text-gray-500 dark:text-gray-400">
								<thead className="text-xs text-gray-600 dark:text-gray-300 text-left uppercase bg-gray-50 dark:bg-gray-800/50">
									<tr>
										<th scope="col" className="px-4 py-3 font-semibold">Comércio</th>
										<th scope="col" className="px-4 py-3 font-semibold text-center">Categoria</th>
										<th scope="col" className="px-4 py-3 font-semibold text-center">Views</th>
										<th scope="col" className="px-4 py-3 font-semibold text-center">Cliques</th>
										<th scope="col" className="px-4 py-3 font-semibold text-center">Contatos</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
									{metrics.topBusinesses.map((biz) => (
										<tr 
											key={biz.business_id} 
											className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
										>
											<td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{biz.business_name}</td>
											<td className="px-6 py-4 text-center">
												<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
													{biz.category}
												</span>
											</td>
											<td className="px-6 py-4 text-center font-medium">{biz.views}</td>
											<td className="px-6 py-4 text-center font-medium">{biz.clicks}</td>
											<td className="px-6 py-4 text-center font-medium">{biz.contacts}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Tabela de Comércios (Mobile Cards View) */}
						<div className="md:hidden space-y-4">
							<h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 px-1">
								<Store className="w-5 h-5" /> 
								Desempenho
							</h2>
							{metrics.topBusinesses.map((biz) => (
								<div 
									key={biz.business_id}
									className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-300 dark:border-gray-700"
								>
									<div className="flex justify-between items-start mb-4">
										<h3 className="font-bold text-gray-900 dark:text-white text-lg">
											{biz.business_name}
										</h3>
										<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
											{biz.category}
										</span>
									</div>
									<div className="grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
										<div className="text-center">
											<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
												Views
											</p>
											<p className="font-bold text-gray-900 dark:text-white">
												{biz.views}
											</p>
										</div>
										<div className="text-center border-l border-r border-gray-100 dark:border-gray-700">
											<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
												Cliques
											</p>
											<p className="font-bold text-gray-900 dark:text-white">
												{biz.clicks}
											</p>
										</div>
										<div className="text-center">
											<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
												Contatos
											</p>
											<p className="font-bold text-gray-900 dark:text-white">
												{biz.contacts}
											</p>
										</div>
									</div>

								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Metrics;
