import {db} from "../../db";
import {and, eq, gte, lt, sum} from "drizzle-orm";
import {categories, transactions} from "../../db/schema";
import {CategorySummary, CategoryTransactionInput, TransactionTotalInput} from "./summary.dto";

export async function getTransactionTotal(data: TransactionTotalInput): Promise<{ total: string | null }[]> {
    return db
        .select({
            total: sum(transactions.amount),
        })
        .from(transactions)
        .where(
            and(
                eq(transactions.userId, data.userId),
                eq(transactions.type, data.type),
                gte(transactions.date, data.startDate),
                lt(transactions.date, data.endDate),
            )
        );
}

export async function getCategoryTransactions(data: CategoryTransactionInput): Promise<CategorySummary[]> {
    return db
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
                eq(transactions.userId, data.userId),
                eq(transactions.type, "EXPENSE"),
                gte(transactions.date, data.startDate),
                lt(transactions.date, data.endDate),
            )
        )
        .groupBy(categories.name);
}