import express from "express";
import { success } from "zod";

const locationRouter = express.Router();

locationRouter.get("/my-ip", async (req, res) => {
    try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        res.json({ success: true, ...data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default locationRouter;

