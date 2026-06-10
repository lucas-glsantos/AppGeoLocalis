import express from "express";
import upload from "../middleware/multer.js";
import { protect } from "../middleware/auth.js";
import { deleteLimiter } from "../middleware/rateLimiter.js";
import { addBusiness, getAllActiveBusinesses, getBusinessById, getNearbyBusinesses, getUserBusinesses, deleteBusinessById, updateBusinessById } from "../controllers/businessController.js";

const businessRouter = express.Router();

businessRouter.post("/add", protect, upload.single("image"), addBusiness);
businessRouter.get("/all", getAllActiveBusinesses);
businessRouter.get("/nearby", getNearbyBusinesses);
businessRouter.get("/user", protect, getUserBusinesses);
businessRouter.get("/:businessId", getBusinessById);
businessRouter.put("/:businessId", protect, upload.single("iamge"), updateBusinessById);
businessRouter.delete("/:businessId", protect, deleteLimiter, deleteBusinessById);

export default businessRouter;