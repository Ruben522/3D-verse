import express from "express";
import {
    follow,
    unfollow,
    followers,
    following,
    check
} from "../controllers/followers.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:userId/followers", followers);
router.get("/:userId/following", following);
router.get("/:userId/check", verifyToken, check);

router.post("/:userId", verifyToken, follow);
router.delete("/:userId", verifyToken, unfollow);

export default router;