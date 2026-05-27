import { useEffect, useState } from "react";
import CommentTableItem from "./CommentTableItem";
import { useApp } from "../../../controllers/AppContext";
import toast from "react-hot-toast";
import { MessageSquare, CheckCircle, XCircle, Loader2 } from "lucide-react";

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [filter, setFilter] = useState("Not Approved");
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

    const filteredComments = comments.filter((comment) => 
        filter === "Approved" ? comment.is_approved === true : comment.is_approved === false
    );

    const approvedCount = comments.filter(c => c.is_approved === true).length;
    const pendingCount = comments.filter(c => c.is_approved === false).length;

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Comentários
                    </h1>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                    <button 
                        onClick={() => setFilter("Not Approved")} 
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            filter === "Not Approved"
                                ? "bg-red-500 text-white shadow-lg"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        <XCircle className="w-4 h-4" />
                        Recusado
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                            filter === "Not Approved" ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"
                        }`}>
                            {pendingCount}
                        </span>
                    </button>
                    <button 
                        onClick={() => setFilter("Approved")} 
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            filter === "Approved"
                                ? "bg-green-500 text-white shadow-lg"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        <CheckCircle className="w-4 h-4" />
                        Aprovado
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                            filter === "Approved" ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"
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
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg border border-gray-100 dark:border-gray-700">
                        <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Nenhum comentário {filter === "Approved" ? "aprovado" : "pendente"}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {filter === "Approved" 
                                ? "Aprove comentários para vê-los aqui."
                                : "Os comentários pendentes/recusados aparecerão aqui."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-600 dark:text-gray-300 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-semibold">Comentário</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Data</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredComments.map((comment, index) => (
                                        <CommentTableItem key={comment.id} comment={comment} index={index + 1} fetchComments={fetchComments} />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden space-y-4">
                            {filteredComments.map((comment) => (
                                <CommentTableItem key={comment.id} comment={comment} fetchComments={fetchComments} isCard={true} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Comments;