import { useEffect, useState, useCallback, useRef } from "react";
import { Store, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useApp } from "../../../../controllers/AppContext";
import BusinessTableItem from "./BusinessTableItem";

const UserListBusiness = () => {
    const { api } = useApp();
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const cancelledRef = useRef(false);

    const fetchBusinesses = useCallback(async () => {
        try {
            setLoading(true);

            const { data } = await api.get("/api/business/user");

            if (cancelledRef.current) return;

            data.success ? setBusinesses(data.businesses) : toast.error(data.message);
        } catch (error) {
            if (error.name === 'CanceledError') return;
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        cancelledRef.current = false;
        fetchBusinesses();
        return () => {
            cancelledRef.current = true;
        };
    }, [fetchBusinesses]);

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Seus Comércios
                    </h1>
                    <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        {businesses.length} {businesses.length === 1 ? 'comércio' : 'comércios' }
                    </span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>

                ) : businesses.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg border border-gray-100 dark:border-gray-700">
                        <Store className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Nenhum comércio cadastrado
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Cadastre seu primeiro comércio!
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-600 dark:text-gray-300 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-semibold">#</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Nome</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Categoria</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">WhatsApp</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {businesses.map((b, i) => (
                                        <BusinessTableItem 
                                            key={b.id}
                                            business={b}
                                            fetchBusinesses={fetchBusinesses}
                                            index={i + 1} /> 
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden space-y-4">
                            {businesses.map((b) => (
                                <BusinessTableItem
                                    key={b.id}
                                    business={b}
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