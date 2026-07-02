import { Favorite } from "../models/Favorite.js"

// Função Adicionar Favorito
export const addFavorite = async (req, res) => {
    try {
        const userId = req.userId;
        const { businessId } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Não autorizado" });
        }

        if (!businessId) {
            return res.status(400).json({ success: false, message: "ID do comércio é obrigatório" });
        }

        await Favorite.add(userId, parseInt(businessId));

        res.status(201).json({ success: true, message: "Comércio favorito" })
    } catch (error) {
        console.error(error); // Remover após validação
        res.status(500).json({ success: false, message: "Erro interno no Servidor" });
    }
};

// Função Remover Favorito
export const removeFavorite = async (req, res) => {
    try {
        const userId = req.userId;
        const { businessId } = req.params;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Não autorizado" });
        }

        await Favorite.remove(userId, parseInt(businessId));

        res.status(200).json({ success: true, message: "Favorito removido" });
    } catch (error) {
        console.error(error); // Remover após validação
        res.status(500).json({ success: false, message: "Erro interno no Servidor" });
    }
};

// Função obter Favoritos
export const getUserFavorites = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Não autorizado" });
        }

        const favorites = await Favorite.findByUser(userId);

        res.status(200).json({ success: true, favorites });
    } catch (error) {
        console.error(error); // Remover após validação
        res.status(500).json({ success: false, message: "Erro interno no Servidor" });
    }
};

// Função para checar favorito
export const checkFavorite = async (req, res) => {
    try {
        const userId = req.userId;
        const { businessId } = req.params;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Não autorizado" });
        }

        const favorited = await Favorite.isFavorited(userId, parseInt(businessId));

        res.status(200).json({ success: true, favorited });
    } catch (error) {
        console.error(error); // Remover após validação 
        res.status(500).json({ success: false, message: "Erro interno no Servidor" });
    }
};