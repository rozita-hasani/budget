import { Router } from "express";
import bcrypt from "bcrypt";

import { db } from "../db";
import { users } from "../db/schema";

const router = Router();

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const createdUser = await db
        .insert(users)
        .values({
            email,
            passwordHash,
        })
        .returning();

    res.status(201).json(createdUser[0]);
});

export default router;