import {createTransaction, getTransactionCategory, updateTransaction} from "./transactions.repository";
import {CreateTransactionInput, Transaction, UpdateTransactionInput} from "./transactions.dto";

export async function handleCreateTransaction(data: CreateTransactionInput) : Promise<Transaction> {
    const category = await getTransactionCategory(data.categoryId, data.userId);

    if (category.length === 0) {
        throw new Error("Category not found");
    }

    const created = await createTransaction(data);

    return created[0];
}

export async function handleTransactionUpdate(data: UpdateTransactionInput): Promise<Transaction> {
    const updated = await updateTransaction(data);

    if (updated.length === 0) {
        throw new Error("Transaction not found");
    }

    return updated[0];
}