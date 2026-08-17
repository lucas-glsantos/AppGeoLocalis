import { useEffect, useState } from "react"


export const useSessionId = () => {
    const [sessionId] = useState(() => 
        localStorage.getItem("metrics_sid") || (typeof crypto?.randomUUID === "function"
            ? crypto.randomUUID()
            : Date.now().toString(36) + Math.random().toString(36).slice(2)
        )
    );

    useEffect(() => {
        localStorage.setItem("metrics_sid", sessionId);
    }, [sessionId]);
    return sessionId;
};