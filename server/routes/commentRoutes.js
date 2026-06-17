import express from "express";
import rateLimit from "express-rate-limit"
import { protect } from "../middleware/auth.js";
import { addComment, getPostApprovedComments, getAuthorComments, toggleCommentById, deleteCommentById } from "../controllers/commentsController.js";

const commentRouter = express.Router();

// rateLimit
const commentLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // Janela de 1 minuto
    max: 3, // Limita cada IP a 3 comentário por minuto
    message: {
        success: false,
        message: "Muitos comentários, Tente novamente."
    },
    standardHeaders: true, // Retorna info de limite nos headers Ratelimit
    legacyHeaders: false,
});

commentRouter.post("/add", protect, commentLimiter, addComment);
commentRouter.get("/post/:postId", getPostApprovedComments);
commentRouter.get("/author", protect, getAuthorComments);
commentRouter.put("/toggle-status/:commentId", protect, toggleCommentById);
commentRouter.delete("/:commentId", protect, deleteCommentById);

export default commentRouter;
