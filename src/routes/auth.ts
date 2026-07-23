import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "../db";
import { users } from "../db/schema";
import {eq} from "drizzle-orm";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req, res) => {
    const { email, password, username } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const createdUser = await db
        .insert(users)
        .values({
            email,
            username,
            passwordHash,
        })
        .returning();

    return res.status(201).json(createdUser[0]);
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    })

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const isPassValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPassValid) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "24h"
        }
    )

    return res.status(200).json({token})
})

export default router;