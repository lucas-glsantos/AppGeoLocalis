import toast from "react-hot-toast";

const counters = new Map();
const COOLDOWN_MS = 60_000; // 60s
const MAX_DISPLAYS = 3; // 3 Tentativas permitidas

export function infoToast(key, message, type = "error") {
    const now = Date.now();
    const entry = counters.get(key);

    if (entry) {
        // Cooldown ativo
        if (entry.resetAt && now < entry.resetAt) {
            // Avisa 1 vez durante cooldown
            if (!entry.warned) {
                toast.error("Faça login, e tente novamente.");
                counters.set(key, { ...entry, warned: true });
            }
            return;
        }

        // Cooldown expirou, limpa e reinicia o ciclo
        if (entry.resetAt && now >= entry.resetAt) {
            counters.delete(key);
        }
    }

    // Exibe toast e incrementa contador
    const prev = counters.get(key);
    const newCount = (prev?.count || 0) + 1;
    // Se atingiu o limite, salva com cooldown futuro
    const resetAt = newCount >= MAX_DISPLAYS ? now + COOLDOWN_MS : null;

    counters.set(key, { count: newCount, resetAt, warned: false });
    toast[type](message);
}