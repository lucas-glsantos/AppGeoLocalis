import express from "express";
import { protect } from "../middleware/auth.js";
import { favoriteLimiter } from "../middleware/rateLimiter.js";
import { addFavorite, removeFavorite, getUserFavorites, checkFavorite } from "../controllers/favoriteController.js";

const favoriteRouter = express.Router();

favoriteRouter.post("/add", protect, favoriteLimiter, addFavorite);
favoriteRouter.delete("/remove/:businessId", protect, favoriteLimiter, removeFavorite);
favoriteRouter.get("/user", protect, getUserFavorites);
favoriteRouter.get("/check/:businessId", protect, checkFavorite);

export default favoriteRouter;