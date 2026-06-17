import { useEffect, useState } from "react";
import CommentTableItem from "./CommentTableItem";
import { useApp } from "../../../controllers/AppContext";
import toast from "react-hot-toast";
import { CheckCircle, Archive, Loader2, MessagesSquare } from "lucide-react";

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [filter, setFilter] = useState("Pendente");
    const [loading, setLoading] = useState(true);

    const { api } = useApp();

    const fetchComments = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/api/comment/author");
            data.success ? setComments(data.comments) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const filteredComments = comments.filter((comment) => { 
        if (filter === "Aprovado") return comment.is_approved === true; 
        return comment.is_approved === false
    });

    const approvedCount = comments.filter(c => c.is_approved === true).length;
    const pendingCount = comments.filter(c => c.is_approved === false).length;

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <MessagesSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Comentários
                    </h1>
                    <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        {comments.length} {comments.length === 0 ? 'comentário' : 'comentários'}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                    <button 
                        onClick={() => setFilter("Pendente")} 
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            filter === "Pendente"
                                ? "bg-yellow-500 text-white shadow-lg"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        <Archive className="w-4 h-4" />
                        Arquivado
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                            filter === "Pendente" 
                                ? "bg-white/20" 
                                : "bg-gray-100 dark:bg-gray-700"
                        }`}>
                            {pendingCount}
                        </span>
                    </button>
                    <button 
                        onClick={() => setFilter("Aprovado")} 
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            filter === "Aprovado"
                                ? "bg-green-500 text-white shadow-lg"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        <CheckCircle className="w-4 h-4" />
                        Aprovado
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                            filter === "Aprovado" ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"
                        }`}>
                            {approvedCount}
                        </span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                ) : filteredComments.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg border border-gray-300 dark:border-gray-700">
                        <MessagesSquare className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            Nenhum comentário {filter === "Aprovado" ? "aprovado" : "arquivado"}
                        </h3>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-6">
                            {filter === "Aprovado" 
                                ? "Gerencie comentários, Aprove para vê-los aqui."
                                : "Os comentários pendentes/arquivados aparecerão aqui."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block relative max-w-4xl overflow-x-auto scrollbar-hide bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
                            <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-600 dark:text-gray-300 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 justify-center">Comentário</th>
                                        <th scope="col" className="px-6 py-4 justify-center">Data</th>
                                        <th scope="col" className="px-6 py-4 justify-center">Status</th>
                                        <th scope="col" className="px-6 py-4 justify-center">Ação</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredComments.map((comment, index) => (
                                        <CommentTableItem 
                                            key={comment.id} 
                                            comment={comment} 
                                            fetchComments={fetchComments}
                                            index={index + 1}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden space-y-4">
                            {filteredComments.map((comment) => (
                                <CommentTableItem 
                                    key={comment.id} 
                                    comment={comment} 
                                    fetchComments={fetchComments} 
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

export default Comments;