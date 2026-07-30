export interface MonthlySummaryInput {
    userId: string;
    year: number;
    month: number;
}

export interface MonthlySummary {
    income: number;
    expense: number;
    balance: number;
}

export interface CategorySummaryInput {
    userId: string;
    year: number;
    month: number;
}

export interface CategorySummary {
    category: string;
    total: string | null;
}

export interface CategorySummaryResponse {
    category: string;
    total: number;
}

export interface TransactionTotalInput {
    userId: string;
    type: "INCOME" | "EXPENSE";
    startDate: Date;
    endDate: Date;
}

export interface CategoryTransactionInput {
    userId: string;
    startDate: Date;
    endDate: Date;
}