import { useApp } from "@/controllers/AppContext";
import { useTheme } from "@/context/theme/ThemeContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { Sun, Moon, ArrowLeftToLine } from "lucide-react";
import LoadingScreen from "@/components/shared/loader/LoadingScreen";
import { assets } from "@/assets/assets";

const clerkAppearance = (darkMode) => ({
    variables: {
        colorPrimary: "#2563eb",
        colorBackground: darkMode ? "#1f2937" : "#ffffff",
        colorText: darkMode ? "#f3f4f6" : "#111827",
        colorTextSecondary: darkMode ? "#9ca3af" : "#6b7280",
        colorInputBackground: darkMode ? "#374151" : "#f9fafb",
        colorInputText: darkMode ? "#f3f4f6" : "#111827",
        colorNeutral: darkMode ? "#6b7280" : "#9ca3af",
    }
});

const Login = () => {
    const { isLoading, isAuthenticated } = useApp();
    const { darkMode, ThemeToggle } = useTheme();
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);

    // Botton Theme Toggle
    const ThemeMode = () => (
        <button
            onClick={ThemeToggle}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
            title={darkMode ? "Modo Claro" : "Modo Escuro"}
        >
            {darkMode
                ? <Sun className="w-5 h-5 text-yellow-500" /> 
                : <Moon className="w-5 h-5" />
            }
        </button>
    );

    // Botton Back to Home
    const BackHomeBtn = ({ full }) => (
        <button
            onClick={() => navigate("/")}
            className={`flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 sm:px-6 py-2.5 hover:opacity-90 transition outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px] ${full ? "w-full justify-center" : ""}`}
            aria-label="Voltar para home"
            title="Voltar"
        >
            <ArrowLeftToLine className="w-4 h-4" />
            <span className="hidden sm:inline">
                Voltar
            </span>
        </button>
    );

    // Logo GeoLocalis
    const LogoGeoLocalis = () => (
        <img 
            onClick={() => navigate("/")}
            className="w-20 cursor-pointer"
            src={assets.geolocalis}
            aria-label="Logo GeoLocalis"
            title="GeoLocalis"
        />
    );

    if (isAuthenticated) {
        navigate("/dashboard");
        return null;
    };

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <LogoGeoLocalis />
                        </div>

                        <div className="flex items-center gap-3">
                            <ThemeMode />

                            <BackHomeBtn />
                        </div>
                        
                    </div>
                </div>
            </nav>
            
            <div className="flex-1 flex items-center justify-center px-4 pb-16 sm:pb-24 m-10">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            {isSignUp ? "Criar conta" : "Bem-vindo de volta"}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isSignUp
                                ? "Cadastrar uma conta na GeoLocalis"
                                : "Entrar na conta GeoLocalis"}
                        </p>
                    </div>
                    
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        {isSignUp ? "Já tem uma conta?" : "Não tem uma conta?"}
                        {" "}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            disabled={isLoading}
                        >
                            {isSignUp ? "Entrar" : "Cadastre-se"}
                        </button>
                    </p>

                    <div className="flex justify-center">
                        {isSignUp ? (
                            <SignUp appearance={clerkAppearance(darkMode)} />
                        ) : (
                            <SignIn appearance={clerkAppearance(darkMode)} />
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;