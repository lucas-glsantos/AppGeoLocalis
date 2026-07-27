import { useMemo, useEffect, useState } from "react";
import { useApp } from "@/controllers/AppContext";
import PostCard from "./PostCardPage";
import { post_categories } from "@/hooks/useCategory";
import { FileText, Loader2, ChevronLeft, ChevronRight } from "lucide-react";


// Componente Principal (PostList)
const PostList = () => {
    const { posts } = useApp();
    const [menu, setMenu] = useState("All");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => (menu === "All" ? true : post.category === menu));
    }, [posts, menu]);

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / ITEMS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);

    const displayPosts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredPosts, currentPage]);

    useEffect(() => {
        setPage(1);
    }, [menu]);

    useEffect(() => {
        if (currentPage > totalPages) setPage(totalPages);
    }, [totalPages, currentPage]);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(posts.length === 0);
        }, 300);
        return () => clearTimeout(timer);
    }, [posts]);

    const categoryMenu = (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {post_categories.map((category) => {
                const value = category.name === "Tudo" ? "All" : category.name; 
                
                return (
                    <button
                        key={category.id}
                        value={value}
                        onClick={() => setMenu(value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[40px] 
                            ${
                                menu === value
                                    ? category.color
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        aria-pressed={menu === value}
                        aria-label={`Filtrar por ${category.name}`}
                        title={`Filtrar por ${category.name}`}
                    >
                        {category.name}
                    </button>
            )})}
        </div>
    );

    return (
        <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                    Carregando...
                                </span>
                            ) : filteredPosts.length === 0 ? (
                                "Nenhum post encontrado"
                            ) : (
                                `${filteredPosts.length} posts publicados`
                            )}
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Descubra novos posts
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Navegue nos melhores conteúdos sobre produtos, tecnologias, negócios e inovação
                    </p>
                </div>

                {categoryMenu}

                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                            <FileText className="w-12 h-12 text-blue-500" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-200 text-lg font-semibold mb-2">
                            Nenhum post encontrado
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                            Nenhum post disponível nesta categoria ainda
                        </p>
                    </div>
                ) : displayPosts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                            Nenhum post nesta categoria
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                            Tente outra categoria ou aguarde novos posts.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Paginação">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage <= 1}
                                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    aria-label="Página anterior"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Anterior</span>
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-10 h-10 rounded-xl text-sm font-medium transition-all min-w-[44px] min-h-[44px] ${
                                                p === currentPage
                                                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            }`}
                                            aria-label={`Página ${p}`}
                                            aria-current={p === currentPage ? "page" : undefined}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage >= totalPages}
                                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    aria-label="Próxima página"
                                >
                                    <span className="hidden sm:inline">Próximo</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default PostList;