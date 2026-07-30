import {db} from "../../db";
import {categories, transactions} from "../../db/schema";
import {and, eq} from "drizzle-orm";
import {
    CreateTransactionInput,
    Transaction,
    TransactionWithCategory ,
    UpdateTransactionInput
} from "./transactions.dto";

export async function getTransactions(data: {userId: string; type?: "INCOME" | "EXPENSE"; categoryId?: string}) : Promise<TransactionWithCategory[]> {
    const conditions = [
        eq(transactions.userId, data.userId),
    ];

    if (data.type) {
        conditions.push(eq(transactions.type, data.type));
    }

    if (data.categoryId) {
        conditions.push(eq(transactions.categoryId, data.categoryId));
    }

    return db
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
}

export async function getTransactionCategory(categoryId:string, userId:string) {
    return db
        .select()
        .from(categories)
        .where(
            and(
                eq(categories.id, categoryId),
                eq(categories.userId, userId)));
}

export async function createTransaction(data: CreateTransactionInput): Promise<Transaction[]> {
    return db
        .insert(transactions)
        .values(data)
        .returning();
}

export async function updateTransaction(data: UpdateTransactionInput): Promise<Transaction[]> {
    return db
        .update(transactions)
        .set({
            amount: data.amount,
            type: data.type,
            note: data.note,
            categoryId: data.categoryId,
        })
        .where(
            and(
                eq(transactions.id, data.id),
                eq(transactions.userId, data.userId)
            )
        )
        .returning();
}

export async function deleteTransaction(id: string, userId: string): Promise<boolean> {
    const deleted = await db
        .delete(transactions)
        .where(
            and(
                eq(transactions.id, id),
                eq(transactions.userId, userId)
            )
        )
        .returning();

    return deleted.length > 0;
}