import { createRoot } from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/theme/ThemeContext.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { AppProvider } from "./controllers/AppContext.jsx";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
    
    <ClerkProvider publishableKey={clerkPubKey}>
        <BrowserRouter>
            <ThemeProvider>
                <AppProvider>
                    <App />
                </AppProvider>
            </ThemeProvider>
        </BrowserRouter>
    </ClerkProvider>
);