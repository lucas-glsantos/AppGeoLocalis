import { assets } from "../assets/assets";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useApp } from "../controllers/AppContext";
import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "../controllers/ThemeContext";
import { Sun, Moon, Menu, X, User, Check, Loader2, LayoutDashboard, LogIn, Search, Settings, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const { user, isLoading, api } = useApp();        // Retorna contexto global (api, navigate)
  const { darkMode, ThemeToggle } = useTheme();      // Retorna estado do tema (darkMode)
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);      // Controla menu mobile aberto/fechado
  const [showNameModal, setShowNameModal] = useState(false);        // Controla modal de nome
  const [userName, setUserName] = useState("");                     // Armazena nome digitado pelo usuário
  const [isSaving, setIsSaving] = useState(false);                  // Indica se está salvando dados

  const modalRef = useRef(null);        // Cria referência para o elemento DOM do modal

  const handleClickOutside = useCallback((event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowNameModal(false);
    }
  }, []);

  // Fecha modal ao clicar fora
  useEffect(() => {
    if (!showNameModal) return;
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNameModal, handleClickOutside]);

  // Salva nome digitado pelo usuário no servidor
  const handleSaveName = async () => {
    if (!userName.trim()) return;
    setIsSaving(true);

    try{
      const response = await api.post("/api/auth/sync", {
        userId: user.id,
        name: userName.trim(),
        email: user?.email || `${user.id}@Clerk.user`,
        image: user?.imageUrl || ""
      });

      if (response.data.success) {
        setShowNameModal(false);
      }
    } catch (error) {
        console.error("Erro ao salvar:", error);
    } finally {
        setIsSaving(false);
    }
  };

  // Fecha menu e navega para dashboard
  const navigateTo = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  // Theme Toggle
  const ThemeMode = () => (
    <button
      onClick={ThemeToggle}
      className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
      aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      )}
    </button>
  );

  // Responsive botton
  const DashboardBtn = ({ full }) => (
    <button 
      onClick={() => navigateTo("/dashboard")} 
      className={`flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 sm:px-6 py-2.5 transition min-h-[44px] ${full ? 'w-full justify-center' : ""}`}
      aria-label="Ir para dashboard"
    >
      <LayoutDashboard className="w-4 h-4" />
      <span className="hidden sm:inline">Dashboard</span>
    </button>
  );

  const LoginBtn = ({ full }) => (
    <button 
      onClick={() => navigate("/login")}
      className={`flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 sm:px-6 py-2.5 transition-colors min-h-[44px] ${full ? "w-full justify-center" : ""}`}
      aria-label="Fazer login"
    >
      <LogIn className="w-4 h-4" />
      <span className="hidden sm:inline">Login</span>
    </button>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="hidden md:flex p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label="Abrir menu lateral"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-red-500" /> : <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={mobileMenuOpen ? "Fechar menu mobile" : "Abrir menu mobile"}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-red-500" /> : <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
              </button>

              <img 
                onClick={() => navigate("/")} 
                src={assets.geolocalis} 
                alt="logo" 
                className="w-20 cursor-pointer" 
              />
            </div>
        
            <div className="flex items-center gap-3">
              <ThemeMode />

              <SignedOut>
                <LoginBtn />
              </SignedOut>
              
              <SignedIn>
                <div className="flex items-center gap-3">
                  <DashboardBtn />
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>

            </div>
          </div>
        </div>
      </nav>

      {/* Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex justify-start">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-80 mt-16 h-[calc(100%-64px)] bg-gray-50 dark:bg-gray-900 shadow-2xl p-6">
            <div className="flex justify-between mb-6">
              <h3 className="text-lg flex items-center gap-2 font-semibold dark:text-white dark:text-gray-900">
                Menu
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigateTo("/dashboard")}
                className="flex items-center gap-3 text-left rounded-lg py-2 px-2 hover:text-blue-500 dark:text-white dark:hover:text-blue-500 transition min-h-[48px]"
                aria-label="Ir para dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>

              <button
                onClick={() => {
                  document.getElementById("search-section")?.scrollIntoView({
                    behavior: "smooth"
                  });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-left rounded-lg py-2 px-2 hover:text-blue-500 dark:text-white dark:hover:text-blue-500 transition min-h-[48px]"
                aria-label="Pesquisar posts"
              >
                <Search className="w-5 h-5" />
                Pesquisar Post
              </button>

              <button
                onClick={() => navigateTo("/nearby")}
                className="flex items-center gap-3 text-left rounded-lg py-2 px-2 hover:text-blue-500 dark:text-white dark:hover:text-blue-500 transition min-h-[48px]"
                aria-label="Comércios próximos"
              >
                <Store className="w-5 h-5" />
                Comércios Próximos
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-3 text-left rounded-lg py-2 px-2 hover:text-blue-500 dark:text-white dark:hover:text-blue-500 transition min-h-[48px]"
                aria-label="Configurações"
              >
                <Settings className="w-5 h-5" />
                Configurações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div ref={modalRef} className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Bem-vindo!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Para continuar, defina seu nome de usuário
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome de usuário
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                  maxLength={50}
                />
              </div>
              
              <button
                onClick={handleSaveName}
                disabled={!userName.trim() || isSaving}
                className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  userName.trim()
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSaving ? 
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                  :
                  <>
                    <Check className="w-5 h-5" />
                    Confirmar
                  </>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;