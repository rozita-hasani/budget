export interface Transaction {
    id: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    date: Date;
    note?: string | null;
    categoryId: string;
    userId: string;
}

export interface TransactionWithCategory extends Transaction{
    category: string;
}

export interface TransactionResponse {
    id: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    date: Date;
    note?: string | null;
    categoryId: string;
}

export interface TransactionWithCategoryResponse extends TransactionResponse {
    category: string;
}

export interface CreateTransactionInput {
    amount: number;
    type: "INCOME" | "EXPENSE";
    note?: string | null;
    categoryId: string;
    userId: string;
}

export interface UpdateTransactionInput {
    amount: number;
    type: "INCOME" | "EXPENSE";
    note?: string | null;
    categoryId: string;
    userId: string;
    id: string;
}