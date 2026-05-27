import { assets } from "../assets/assets";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useApp } from "../controllers/AppContext";
import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "../controllers/ThemeContext";
import { Sun, Moon, Menu, X, User, Check, Loader2, LayoutDashboard, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const { user, isLoading, api } = useApp();        // Retorna contexto global (api, navigate)
  const { darkMode, ThemeToggle } = useTheme();      // Retorna estado do tema (darkMode)
  const navigate = useNavigate();

  const [sideMenuOpen, setSideMenuOpen] = useState(false);
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
            <img 
              onClick={() => navigate("/")} 
              src={assets.geolocalis} 
              alt="logo" 
              className="w-20 cursor-pointer" 
            />
        
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSideMenuOpen((prev) => !prev)}
                className="hidden md:flex p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                aria-label="Abrir menu lateral"
              >
                {sideMenuOpen ? <X className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={mobileMenuOpen ? "Fechar menu mobile" : "Abrir menu mobile"}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
              </button>

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

          {/* Menu Mobile */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 flex flex-col gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              <SignedOut>
                <LoginBtn full />
              </SignedOut>
                
              <SignedIn>
                <DashboardBtn full />
              </SignedIn>
            </div>
          )}
        </div>
      </nav>

      {/* Drawer */}
      {sideMenuOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setSideMenuOpen(false)}
          />

          <div className="relative w-80 mt-16 h-[calc(100%-64px)] bg-white dark:bg-gray-900 shadow-2xl p-6">
            <div className="flex justify-between mb-6">
              <h3 className="text-lg font-semibold dark:text-white dark:text-gray-900">
                Menu
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => navigateTo("/dashboard")}
                className="text-left hover:text-blue-500 dark:text-gray-900 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition min-h-[48px]"
                aria-label="Ir para dashboard"
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  document.getElementById("search-section")?.scrollIntoView({
                    behavior: "smooth"
                  });
                  setSideMenuOpen(false);
                }}
                className="text-left hover:text-blue-500 dark:text-gray-900 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition min-h-[48px]"
                aria-label="Pesquisar posts"
              >
                Pesquisar Post
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="text-left hover:text-blue-500 dark:text-gray-900 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition min-h-[48px]"
                aria-label="Configurações"
              >
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