import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            // Verifica se o usuário já tem uma preferência salva
            const saved = localStorage.getItem("darkMode");
            if (saved !== null) return JSON.parse(saved);

            // Se não tiver, verifica a preferência do sistema operacional
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
        const root = window.document.documentElement;
        
        if (darkMode) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [darkMode]);

    const ThemeToggle = () => setDarkMode(!darkMode);

    return (
        <ThemeContext.Provider value={{ darkMode, ThemeToggle }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);