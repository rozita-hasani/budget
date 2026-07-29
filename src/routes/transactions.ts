import express from "express";
import {db} from "../db";
import {categories, transactions} from "../db/schema";
import {and, eq} from "drizzle-orm";
import {transactionSchema} from "../validations/transaction";

const router = express.Router();

router.get("/", async (req, res) => {
    const { type, categoryId } = req.query;
    const conditions = [
        eq(transactions.userId, req.user!.userId),
    ];

    if (type) {
        conditions.push(
            eq(transactions.type, type as "INCOME" | "EXPENSE")
        );
    }

    if (categoryId) {
        conditions.push(
            eq(transactions.categoryId, categoryId as string)
        );
    }

    const result = await db
        .select({
            id: transactions.id,
            amount: transactions.amount,
            type: transactions.type,
            date: transactions.date,
            note: transactions.note,
            category: categories.name,
            categoryId: transactions.categoryId,
            userId: transactions.userId,
        })
        .from(transactions)
        .innerJoin(
            categories,
            eq(transactions.categoryId, categories.id)
        )
        .where(and(...conditions));

    return res.json(result);
});

router.post("/", async (req, res) => {
    const result = transactionSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    const { amount, type, note, categoryId } = result.data;
    const userId = req.user!.userId;

    const category = await db
        .select()
        .from(categories)
        .where(
            and(
                eq(categories.id, categoryId),
                eq(categories.userId, userId)));

    if (category.length === 0) {
        return res.status(404).json({message: "Category not found"});
    }

    const createdTransaction = await db
        .insert(transactions)
        .values({
            amount,
            type,
            note,
            categoryId,
            userId,
        })
        .returning();

    return res.status(201).json(createdTransaction[0]);
});

router.put("/:id", async (req, res) => {
    const id = req.params.id as string;
    const result = transactionSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    const {amount, type, note, categoryId} = result.data;
    const userId = req.user!.userId;

    const updated = await db
        .update(transactions)
        .set({amount, type, note, categoryId})
        .where(
            and(
                eq(transactions.id, id),
                eq(transactions.userId, userId)
            )
        )
        .returning();

    if (updated.length === 0) {
        return res.status(404).json({message: "Transaction not found"});
    }

    return res.json(updated[0]);
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id as string;

    await db
        .delete(transactions)
        .where(
            and(
                eq(transactions.id, id),
                eq(transactions.userId, req.user!.userId)
            )
        )

    return res.status(204).send();
})

export default router;