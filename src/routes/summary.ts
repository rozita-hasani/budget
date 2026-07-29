import express from 'express'
import {db} from "../db";
import {categories, transactions} from "../db/schema";
import {and, eq, sum} from "drizzle-orm";

const router = express.Router();

router.get("/monthly", async (req, res) => {
    const userId = req.user!.userId;

    const incomeResult = await db
        .select({
            total: sum(transactions.amount),
        })
        .from(transactions)
        .where(
            and(
                eq(transactions.userId, userId),
                eq(transactions.type, "INCOME")
            )
        );
    const income = Number(incomeResult[0].total ?? 0);

    const expenseResult = await db
        .select({
            total: sum(transactions.amount),
        })
        .from(transactions)
        .where(
            and(
                eq(transactions.userId, userId),
                eq(transactions.type, "EXPENSE")
            )
        );
    const expense = Number(expenseResult[0].total ?? 0);

    const balance = income - expense;

    return res.json({income, expense, balance,});
});

router.get("/by-category", async (req, res) => {
    const userId = req.user!.userId;

    const result  = await db
        .select({
            category: categories.name,
            total: sum(transactions.amount),
        })
        .from(transactions)
        .innerJoin(
            categories,
            eq(transactions.categoryId, categories.id)
        )
        .where(
            and(
                eq(transactions.userId, userId),
                eq(transactions.type, "EXPENSE")
            )
        )
        .groupBy(categories.name);

    return res.json({result});
})

export default router;