import { useApp } from "@/controllers/AppContext";
import { useTheme } from "@/context/theme/ThemeContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import LoadingScreen from "@/components/shared/loader/LoadingScreen";
import { assets } from "@/assets/assets";

const clerkAppearance = (darkMode) => ({
    variables: {
        colorPrimary: "#2563eb",
        colorBackground: "transparent",
        colorText: darkMode ? "#f3f4f6" : "#111827",
        colorTextSecondary: darkMode ? "#9ca3af" : "#6b7280",
        colorInputBackground: darkMode ? "#374151" : "#f9fafb",
        colorInputText: darkMode ? "#f3f4f6" : "#111827",
        colorNeutral: darkMode ? "#6b7280" : "#9ca3af",
        borderRadius: "0.5rem",
    },
    elements: {
        // Removemos sombras e bordas do Clerk para que nosso container controle o estilo
        card: "shadow-none border-none p-0 bg-transparent w-full",
        headerTitle: "hidden", // Esconde o h1 padrão do clerk
        headerSubtitle: "hidden", // Esconde o subtítulo padrão do clerk
        footer: "hidden", // Esconde o rodapé padrão
        footerAction: "hidden", // Oculta Sessão "Already have an Account?"
        watermark: "hidden", // Oculta a marca "Secured by Clerk"
        formButtonPrimary: "font-semibold shadow-sm",
    }
});

const Login = () => {
    const { isLoading, isAuthenticated } = useApp();
    const { darkMode, ThemeToggle } = useTheme();
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);

    useEffect(() => {
        if (isAuthenticated && isLoading) {
        navigate("/dashboard");
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading || isAuthenticated) {
        return <LoadingScreen />;
    }

    // Botton Theme Toggle
    const ThemeMode = () => (
        <button
            onClick={ThemeToggle}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition min-w-11 min-h-11 flex items-center justify-center"
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
            className={`flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 sm:px-6 py-2.5 hover:opacity-90 transition outline-none focus:ring-2 focus:ring-blue-500 min-h-12 ${full ? "w-full justify-center" : ""}`}
            aria-label="Voltar para home"
            title="Voltar"
        >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">
                Voltar
            </span>
        </button>
    );

    // Logo GeoLocalis
    const LogoGeoLocalis = () => (
        <img 
            onClick={() => navigate("/")}
            className="h-20 cursor-pointer hover:opacity-80 transition-opacity"
            src={assets.geolocalis}
            draggable={false}
        />
    );


    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-950 transition-colors duration-500 overflow-hidden px-4 sm:px-6">
            
            {/* Efeitos de Fundo Glow/Blur */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Navegação Flutuante no Topo */}
            <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <BackHomeBtn />

                <ThemeMode />
            </header>

            {/* Container Principal do Formulário */}
            <div className="w-full max-w-105 z-10">
                
                {/* Logo Centralizada */}
                <div className="flex justify-center mb-8">
                    <LogoGeoLocalis />
                </div>

                {/* Card Autenticação */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/50 p-6 sm:p-8 backdrop-blur-xl">
                        
                    {/* Header Customizado */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                            {isSignUp ? "Crie sua conta" : "Bem-vindo de volta"}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isSignUp
                                ? "Preencha os dados abaixo para começar"
                                : "Insira suas credenciais para acessar a plataforma"
                            }
                        </p>
                    </div>
                    
                    {/* Componente Clerk */}
                    <div className="min-h-75 flex items-center justify-center">
                        {isSignUp ? (
                            <SignUp appearance={clerkAppearance(darkMode)} routing="virtual" />
                        ) : (
                            <SignIn appearance={clerkAppearance(darkMode)} routing="virtual" />
                        )}
                    </div>

                    {/* Rodapé Customizado - Alternância Login/Cadastro */}
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {isSignUp ? "Já possui uma conta?" : "Ainda não tem uma conta?"}
                            {" "}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors focus:outline-none"
                                disabled={isLoading}
                            >
                                {isSignUp ? "Fazer login" : "Cadastre-se grátis"}
                            </button>
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Login;