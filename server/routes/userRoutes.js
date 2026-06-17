import express from "express";
import { protect } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Posts } from "../models/Posts.js";
import { Comment } from "../models/Comment.js";
import { Business } from "../models/Business.js";

const userRouter = express.Router();

userRouter.get("/me", protect, async (req, res) => {
    try {
        const user = await User.findUserByClerkId(req.userId);
        if (user) {
            res.status(200).json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: "Usuário não encontrado" });
        }
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

userRouter.get("/dashboard", protect, async (req, res) => {
    try {
        const posts = await Posts.findByAuthor(req.userId);
        const comments = await Comment.findByAuthor(req.userId);
        const businesses = await Business.findByAuthor(req.userId);

        const dashboardData = {
            posts: posts.length,
            comments: comments.length,
            drafts: posts.filter(p => !p.is_published).length,
            userBusiness: businesses[0] || null,
            recentPosts: posts.slice(0, 5)
        };
        
        res.status(200).json({ success: true, dashboardData });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

userRouter.get("/posts", protect, async (req, res) => {
    try {
        const posts = await Posts.findByAuthor(req.userId);
        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

export default userRouter;