import {createTransaction, getTransactionCategory, updateTransaction} from "./transactions.repository";

export async function handleCreateTransaction(data: {
    amount: number;
    type: "INCOME" | "EXPENSE";
    note?: string;
    categoryId: string;
    userId: string;
}) {
    const category = await getTransactionCategory(data.categoryId, data.userId);

    if (category.length === 0) {
        throw new Error("Category not found");
    }

    const created = await createTransaction(data);

    return created[0];
}

export async function handleTransactionUpdate(data: {
    amount: number;
    type: "INCOME" | "EXPENSE";
    note?: string;
    categoryId: string;
    userId: string;
    id: string;
}) {
    const updated = await updateTransaction(data);

    if (updated.length === 0) {
        throw new Error("Transaction not found");
    }

    return updated[0];
}