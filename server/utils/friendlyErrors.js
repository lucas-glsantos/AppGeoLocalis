// Converte Zod format() em uma mensagem legível
export function firstZodMessage(zodFormat, fallback = "Verifique os campos e tente novamente!") {
    try {
        const stack = [];
        const walk = (node, path = []) => {
            if (!node || typeof node !== "object") return;

            if (Array.isArray(node.errors) && node._errors.length) stack.push(node._errors[0]);

            for (const [key, value] of Object.entries(node)) {
                if (key === "_errors") continue;
                
                walk(value, [...path, key]);
            }
        };
        walk(zodFormat);
        return stack[0] || fallback;

    } catch {
        return fallback;
    }
}


export const simpleMessages = {
    unauthorized: "Você precisa estar logado para continuar",
    requiredImage: "Envie uma foto do comércio",
    invalidId: "Comércio não encontrado. Atualize a página e tente novamente",
    serverError: "Algo deu errado. Tente novamente em instantes",
};