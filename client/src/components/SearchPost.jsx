import { useApp } from "@/controllers/AppContext";
import PostCard from "@/pages/PostCardPage";
import { Search, X, FileText, User } from "lucide-react";
import { useRef } from "react";

const SearchPost = () => {
    const { posts, input, setInput } = useApp();
    const inputRef = useRef();

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const value = inputRef.current?.value?.trim() || "";
        setInput(value);
    };

    const onClear = () => {
        setInput("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const searchTerm = input?.toLowerCase().trim();

    const filteredPosts = posts.filter((post) => {
        const titleMatch = post.title?.toLowerCase() === searchTerm;
        const authorMatch = post.author_name?.toLowerCase() === searchTerm;
        return titleMatch || authorMatch;
    });

    const showResults = input && input.trim() !== "";

    return (
        <section id="search-section" className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-6">
                <form onSubmit={onSubmitHandler} className="max-w-lg mx-auto mb-8">
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                        <input 
                            ref={inputRef}
                            type="text" 
                            placeholder="Digite o título ou autor do post..." 
                            className="w-full pl-12 pr-24 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all shadow-lg"
                        />
                        <button 
                            type="submit" 
                            className="absolute right-2 px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:opacity-90 transition-all"
                        >
                            Pesquisar
                        </button>
                    </div>
                </form>

                {showResults ? (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                    <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                        Resultados da Busca
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {filteredPosts.length} {filteredPosts.length === 1 ? 'resultado' : 'resultados'} para "{input}"
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={onClear}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full transition-colors duration-300 hover:bg-red-500 hover:text-white hover:border-red-500"
                            >
                                <X className="w-4 h-4" />
                                Limpar busca
                            </button>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 dark:text-gray-500 mb-8">
                            <span className="inline-flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                Buscar por Título
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <User className="w-3 h-3" />
                                Buscar por Autor
                            </span>
                        </div>

                        {filteredPosts.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Nenhum post encontrado
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    Verifique se o título ou nome do autor está correto.
                                </p>
                                <button 
                                    onClick={onClear}
                                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                >
                                    Fazer nova busca
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPosts.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Utilize a barra de pesquisa acima
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                            Digite o título ou o nome do autor para encontrar posts
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SearchPost;