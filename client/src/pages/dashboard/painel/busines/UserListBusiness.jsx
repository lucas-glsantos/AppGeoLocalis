import { useEffect, useState, useCallback, useRef } from "react";
import { Store, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useApp } from "@/controllers/AppContext";
import BusinessTableItem from "./BusinessTableItem";
import { useNavigate } from "react-router-dom";

const UserListBusiness = () => {
    const { api } = useApp();
    const [businesses, setBusinesses] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const cancelledRef = useRef(false);
    const abortControllerRef = useRef(null);
    const navigate = useNavigate();

    // Função Buscar Business
    const fetchBusinesses = useCallback(async (signal) => {
        try {
            setIsLoading(true);

            const { data } = await api.get("/api/business/user", { signal });

            if (cancelledRef.current) return;

            if (data.success) {
                setBusinesses(data.businesses);
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

        fetchBusinesses(abortControllerRef.current.signal);

        return () => {
            cancelledRef.current = true;
            abortControllerRef.current?.abort();
        };
    }, [fetchBusinesses]);

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Store className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Seu Comércio
                    </h1>
                    <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        {businesses.length} {businesses.length === 1 ? 'comércios' : 'comércio'}
                    </span>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>

                ) : businesses.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg border border-gray-300 dark:border-gray-700">
                        <Store className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            Nenhum comércio cadastrado
                        </h2>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-6">
                            Cadastre e gerencie seu comércio!
                        </p>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => navigate("/dashboard/add-business")}
                                className="w-auto p-4 sm:px-6 sm:py-4 border border-gray-800 dark:border-gray-400 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Cadastar Comércio"
                            >
                                <Store className="w-4 h-4" />
                                Cadastrar
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block relative max-w-4xl overflow-x-auto scrollbar-hide bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
                            <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-600 dark:text-gray-300 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 justify-center">#</th>
                                        <th scope="col" className="px-6 py-4 justify-center">Comércio</th>
                                        <th scope="col" className="px-6 py-4 justify-center">Data</th>
                                        <th scope="col" className="px-6 py-4 justify-center">Categoria</th>
                                        <th scope="col" className="px-6 py-4 justify-center">WhatsApp</th>
                                        <th scope="col" className="px-6 py-4 justify-center">Status</th>
                                        <th scope="col" className="px-6 py-4 justify-center">Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {businesses.map((business, index) => (
                                        <BusinessTableItem
                                            key={business.id}
                                            business={business}
                                            fetchBusinesses={fetchBusinesses}
                                            index={index + 1} 
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden space-y-4">
                            {businesses.map((business) => (
                                <BusinessTableItem
                                    key={business.id}
                                    business={business}
                                    fetchBusinesses={fetchBusinesses}
                                    isCard={true}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserListBusiness;