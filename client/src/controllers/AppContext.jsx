import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useAuth as useClerkAuth, useUser as useClerkUser, useClerk } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

let interceptorId = null;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { userId, isLoaded: clerkLoaded, getToken } = useClerkAuth();
    const { user: clerkUser, isLoaded } = useClerkUser();

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [posts, setPosts] = useState([]);
    const [input, setInput] = useState("");
    const getTokenRef = useRef(getToken);
    const signOutRef = useRef(null);
    const clerk = useClerk();
    const userLoadedRef = useRef(false);


    // Função Buscar posts
    const fetchPosts = useCallback(async () => {
        try {
            const { data } = await axios.get("/api/post/all");
            data.success ? setPosts(data.posts) : toast.error(data.message);
        } catch (error) {
            console.error("Fetch posts error:", error);
        }

    }, []);

    useEffect(() => {
        getTokenRef.current = getToken;
    }, [getToken]);

    useEffect(() => {
        signOutRef.current = () => clerk.signOut();
    }, [clerk]);

    useEffect(() => {
        if (interceptorId === null) {
            interceptorId = axios.interceptors.request.use(
                async (config) => {
                    const tokenGetter = getTokenRef.current;
                    if (tokenGetter) {
                        try {
                            const token = await tokenGetter();
                            config.headers.Authorization = `Bearer ${token}`;
                        } catch (error) {
                            console.error("Token error:", error);
                        }
                    }
                    return config;
                },
                (error) => Promise.reject(error)
            );

            axios.interceptors.response.use(
                (response) => response,
                async (error) => {
                    if (error.response?.status === 401) {
                        const signOut = signOutRef.current;

                        if (signOut) {
                            try { 
                                await signOut(); 
                            } catch {error}
                        }
                        
                        if (!window.location.pathname.startsWith("/login")) {
                            window.location.href = "/login";
                        }
                    }
                    return Promise.reject(error);
                }
            );
        }
        return () => {
            if (interceptorId !== null) {
                axios.interceptors.request.eject(interceptorId);
                interceptorId = null;
            }
        };
    }, []);

    // Função Carregar e Sincronizar Usuário
    const loadUser = useCallback(async () => {
        if (!clerkLoaded || !isLoaded) return;
        if (userLoadedRef.current) return;

        userLoadedRef.current = true;
        setIsLoading(true);

        try {
            if (userId && clerkUser) {
                const name = clerkUser.fullName || clerkUser.firstName || localStorage.getItem("userName");
                const image = clerkUser.imageUrl || localStorage.getItem("userImage");
                const email = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.primaryEmailAddress?.email || clerkUser.emailAddresses?.[0]?.emailAddress;

                setUser({ id: userId, name, image, email });
                setIsAuthenticated(true);

                if (!localStorage.getItem("userSynced")) {
                    axios.post("/api/auth/sync", { name, email, image })
                        .then(res => {
                            if (res.data.success) {
                                localStorage.setItem("userSynced", "true");
                            }
                        })
                        .catch(error => console.error("Erro no auto-sync:", error));
                }

            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Auth error:", error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, [userId, clerkLoaded, isLoaded, clerkUser]);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    
    // Slice de Autenticação do Context
    const authValue = useMemo(() => ({
        user,
        isAuthenticated,
        isLoading,
        getToken,
    }), [user, isAuthenticated, isLoading, getToken]);

    // Slice de Posts do Context
    const postsValue = useMemo(() => ({
        posts,
        setPosts,
        input,
        setInput,
        fetchPosts,
    }), [posts, input, fetchPosts]);

    // Instância Axios Exposta como api
    const apiValue = useMemo(() => axios, []);

    // Valor Combinado do Provider
    const value = useMemo(() => ({
        ...authValue,
        ...postsValue,
        api: apiValue,
    }), [authValue, postsValue, apiValue])

    // Renderização do Provider
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};

export default AppContext;