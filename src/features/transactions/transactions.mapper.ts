import {Transaction, TransactionWithCategoryResponse, TransactionResponse} from "./transactions.dto";

export function toTransactionResponse(transaction: Transaction): TransactionResponse {
    return {
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date,
        note: transaction.note,
        categoryId: transaction.categoryId,
    }
}

export function toTransactionListResponse(transaction: Transaction & {category: string}): TransactionWithCategoryResponse {
    return {
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date,
        note: transaction.note,
        categoryId: transaction.categoryId,
        category: transaction.category
    }
}