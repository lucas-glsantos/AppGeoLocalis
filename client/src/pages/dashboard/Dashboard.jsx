import { useEffect, useState } from "react";
import PostTableItem from "./painel/PostTableItem";
import { useApp } from "../../controllers/AppContext";
import toast from "react-hot-toast";
import { FileDown, Archive, MessagesSquare, StickyNotes, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        posts: 0,
        comments: 0,
        drafts: 0,
        businesses: 0,
        userBusiness: null,
        recentPosts: [],
    });

    const navigate = useNavigate();

    const { api } = useApp();

    const fetchDashboard = async () => {
        try {
            const { data } = await api.get("/api/user/dashboard");
            data.success ? setDashboardData(data.dashboardData) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    return (
        <div className="flex-1 p-4 md:p-10 bg-gray-100 dark:bg-gray-800/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 min-w-58 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg shadow cursor-pointer hover:bg-blue-300 hover:border-blue-600 dark:hover:bg-blue-900/30 dark:hover:border-blue-600 hover:scale-105 transition-all">
                    <StickyNotes className="w-8 h-8" />
                    <div>
                        <p className="text-xl font-semibold text-gray-600 dark:text-gray-200">{dashboardData.posts}</p>
                        <p className="text-gray-600 dark:text-gray-300 font-semibold">Posts publicados</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 min-w-58 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg shadow cursor-pointer hover:bg-blue-300 hover:border-blue-600 dark:hover:bg-blue-900/30 dark:hover:border-blue-600 hover:scale-105 transition-all">
                    <MessagesSquare className="w-8 h-8" />
                    <div>
                        <p className="text-xl font-semibold text-gray-600 dark:text-gray-200">{dashboardData.comments}</p>
                        <p className="text-gray-600 dark:text-gray-300 font-semibold">Comentários</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 min-w-58 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg shadow cursor-pointer hover:bg-blue-300 hover:border-blue-600 dark:hover:bg-blue-900/30 dark:hover:border-blue-600 hover:scale-105 transition-all">
                    <Archive className="w-8 h-8" />
                    <div>
                        <p className="text-xl font-semibold text-gray-600 dark:text-gray-200">{dashboardData.drafts}</p>
                        <p className="text-gray-600 dark:text-gray-300 font-semibold">Posts arquivados</p>
                    </div>
                </div>

                <div 
                    className="flex items-center gap-4 p-4 min-w-58 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg shadow cursor-pointer hover:bg-blue-300 hover:border-blue-600 dark:hover:bg-blue-900/30 dark:hover:border-blue-600 hover:scale-105 transition-all"
                    onClick={() => navigate("/dashboard/list-business")}
                    title="Ver Comércios"
                >
                    <Store className="w-8 h-8" />
                    <div>
                        <p className="text-xl font-bold text-gray-600 dark:text-gray-200">
                            {dashboardData.userBusiness?.name || "Nenhum"}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 font-semibold">Comércio</p>
                    </div> 
                </div>

            </div>

            <div>
                <div className="flex items-center gap-3 m-4 mt-6">
                    <FileDown className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Últimos Posts
                    </h1>
                </div>

                <div className="flex items-center overflow-x-auto scrollbar-hide bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-600 dark:text-gray-300 text-left uppercase">
                            <tr>
                                <th scope="col" className="px-6 py-4 justify-center">#</th>
                                <th scope="col" className="px-6 py-4 justify-center">Post</th>
                                <th scope="col" className="px-6 py-4 justify-center">Data</th>
                                <th scope="col" className="px-6 py-4 justify-center">Categoria</th> 
                                <th scope="col" className="px-6 py-4 justify-center">Status</th>
                                <th scope="col" className="px-6 py-4 justify-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.recentPosts.map((post, index) => (
                                <PostTableItem key={post.id} post={post} fetchPosts={fetchDashboard} index={index + 1} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;