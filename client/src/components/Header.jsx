import { Search } from "lucide-react";
import { useApp } from "../controllers/AppContext";

const Header = () => {
    const { setInput } = useApp();
    const inputRef = { current: { value: "" } };
    
    let localInputRef;
    if (typeof window !== "undefined") {
        localInputRef = localStorage.getItem("searchInput") || "";
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const value = e.target.searchInput?.value?.trim() || localInputRef;
        setInput(value);
    };

    return (
        <header className="relative overflow-hidden">
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-xl will-change-transform" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-xl will-change-transform" />            
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24 lg:py-32 transition-colors duration-300">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 mb-6 bg-green-100 dark:bg-green-900/30 rounded-full text-sm text-green-700 dark:text-green-400">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span>Em Desenvolvimento</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-500 dark:to-blue-600">GeoLocalis</span><br/>Encontre comércios próximos a Você
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                        Publique seu produto, negócios e ideias com a comunidade.
                    </p>
                </div>
            </div>
        </header>
    );
};

export default Header;