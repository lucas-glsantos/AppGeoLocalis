import express from "express";
import upload from "../middleware/multer.js";
import { protect } from "../middleware/auth.js";
import { postLimiter, deleteLimiter } from "../middleware/rateLimiter.js";
import { addPost, getAllPublishedPosts, getPublishedPostById, getPostById, deletePostById, togglePublish } from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/add", protect, postLimiter, upload.single("image"), addPost);
postRouter.get("/all", getAllPublishedPosts);
postRouter.get("/published/:postId", getPublishedPostById);
postRouter.get("/:postId", protect, getPostById);
postRouter.delete("/delete/:postId", protect, deleteLimiter, deletePostById);
postRouter.put("/toggle-publish/:postId", protect, togglePublish);

export default postRouter;