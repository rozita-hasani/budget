import express from 'express'
import {db} from "../db";
import {categories, transactions} from "../db/schema";
import {and, eq, sum, gte, lt} from "drizzle-orm";

const router = express.Router();

router.get("/monthly", async (req, res) => {
    const userId = req.user!.userId;
    const year = Number(req.query.year);
    const month = Number(req.query.month);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const incomeResult = await db
        .select({
            total: sum(transactions.amount),
        })
        .from(transactions)
        .where(
            and(
                eq(transactions.userId, userId),
                eq(transactions.type, "INCOME"),
                gte(transactions.date, startDate),
                lt(transactions.date, endDate),
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
                eq(transactions.type, "EXPENSE"),
                gte(transactions.date, startDate),
                lt(transactions.date, endDate),
            )
        );
    const expense = Number(expenseResult[0].total ?? 0);

    const balance = income - expense;

    return res.json({income, expense, balance,});
});

router.get("/by-category", async (req, res) => {
    const userId = req.user!.userId;
    const year = Number(req.query.year);
    const month = Number(req.query.month);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

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
                eq(transactions.type, "EXPENSE"),
                gte(transactions.date, startDate),
                lt(transactions.date, endDate),
            )
        )
        .groupBy(categories.name);

    return res.json({result});
})

export default router;