import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import PostTableItem from "./painel/PostTableItem";
import { useApp } from "../../controllers/AppContext";
import toast from "react-hot-toast";
import { MessageSquare } from "lucide-react";

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        posts: 0,
        comments: 0,
        drafts: 0,
        recentPosts: [],
    });

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
        <div className="flex-1 p-4 md:p-10 bg-gray-100 dark:bg-gray-800">
            <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
                    <img src={assets.dashboard_icon_1} alt="" className="dark:invert" />
                    <div>
                        <p className="text-xl font-semibold text-gray-600 dark:text-gray-200">{dashboardData.posts}</p>
                        <p className="text-gray-400 font-light">Postagens</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
                    <img src={assets.dashboard_icon_2} alt="" className="dark:invert" />
                    <div>
                        <p className="text-xl font-semibold text-gray-600 dark:text-gray-200">{dashboardData.comments}</p>
                        <p className="text-gray-400 font-light">Comentários</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
                    <img src={assets.dashboard_icon_3} alt="" className="dark:invert" />
                    <div>
                        <p className="text-xl font-semibold text-gray-600 dark:text-gray-200">{dashboardData.drafts}</p>
                        <p className="text-gray-400 font-light">Arquivados</p>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-3 m-4 mt-6 text-gray-600 dark:text-gray-200">
                    <img src={assets.dashboard_icon_4} alt="" className="dark:invert" />
                    <p>Últimos Posts</p>
                </div>

                <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white dark:bg-gray-900">
                    <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-600 dark:text-gray-300 text-left uppercase">
                            <tr>
                                <th scope="col" className="px-2 py-4 xl:px-6">#</th>
                                <th scope="col" className="px-2 py-4">Título do Post</th>
                                <th scope="col" className="px-2 py-4 max-sm:hidden">Data</th>
                                <th scope="col" className="px-2 py-4 max-sm:hidden">Status</th>
                                <th scope="col" className="px-2 py-4">Ações</th>
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