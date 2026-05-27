import { Posts } from "../models/Posts.js";
import { Comment } from "../models/Comment.js";

// Função Adicionar comentário
export const addComment = async (req, res) => {
    try {
        const { post, name, content } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Não autorizado" });
        }

        if (!name || !content) {
            return res.status(400).json({ success: false, message: "Nome e conteúdo são obrigatórios" });
        }

        const postData = await Posts.findById(parseInt(post));

        if (!postData) {
            return res.status(404).json({ success: false, message: "Post não encotrado" });
        }

        const comment = await Comment.create({ 
            post: parseInt(post), 
            name, 
            content, 
            author: postData.author_id 
        });

        res.status(201).json({ success: true, message: "Comentário adicionado para revisão", comment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Função Obter comentários aprovados de um post
export const getPostApprovedComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: parseInt(postId), isApproved: true });
        res.status(200).json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Função Obter comentários do autor logado
export const getAuthorComments = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Não autorizado" });
        }
        const comments = await Comment.findByAuthor(userId);
        res.status(200).json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Função Aprovar comentário por ID
export const approveCommentById = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Não autorizado" });
        }
        
        const comment = await Comment.findById(parseInt(commentId));
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comentário não encontrado" });
        }

        const post = await Posts.findById(comment.post);
        const isPostAuthor = post?.author_id === userId;

        if (!isAdmin && !isPostAuthor) {
            return res.status(403).json({ success: false, message: "Você só pode aprovar comentários dos seus posts "});
        }

        await Comment.findOneAndUpdate({ id: parseInt(commentId) }, { is_approved: true });
        res.status(200).json({ success: true, message: "Comentário aprovado com sucesso" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Função Deletar comentário por ID
export const deleteCommentById = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Não autorizado" });
        }
        
        const comment = await Comment.findById(parseInt(commentId));
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comentário não encontrado" });
        }

        const post = await Posts.findById(comment.post);
        const isPostAuthor = post?.author_id === userId;
        const isCommentAuthor = comment.author === userId;

        if (!isAdmin && !isPostAuthor && !isCommentAuthor) {
            return res.status(403).json({ success: false, message: "Você não tem permissão para deletar este comentário" });
        }

        await Comment.findOneAndDelete({ id: parseInt(commentId) });
        res.status(200).json({ success: true, message: "Comentário deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};