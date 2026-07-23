import {Router} from 'express';
import {db} from "../db"
import {categories} from "../db/schema";
import {and, eq} from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
    const {name, color} = req.body;
    const userId = req.user!.userId;

    const createdCategory = await db
        .insert(categories)
        .values({
            name,
            color,
            userId,
        })
        .returning();

    return res.status(201).json(createdCategory[0]);
})

router.get("/", async (req, res) => {
    const result = await db
        .select()
        .from(categories)
        .where(eq(categories.userId, req.user!.userId))


    return res.json(result)
})

router.put("/:id", async (req, res) => {
    const id = req.params.id as string;
    const {name, color} = req.body;

    const updated = await db
        .update(categories)
        .set({
            name,
            color,
        })
        .where(
            and(
                eq(categories.id, id),
                eq(categories.userId, req.user!.userId)
            )
        )
        .returning();

    return res.json(updated[0]);
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id as string;

    await db
        .delete(categories)
        .where(
            and(
                eq(categories.id, id),
                eq(categories.userId, req.user!.userId)
            )
        )

    return res.status(204).send();
})

export default router;