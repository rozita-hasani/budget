import {getCategoryTransactions, getTransactionTotal} from "./summary.repository";
import {
    CategorySummaryInput,
    CategorySummaryResponse,
    MonthlySummary,
    MonthlySummaryInput
} from "./summary.dto";
import {toCategorySummaryResponse} from "./summary.mapper";

export async function calculateMonthlySummary(data: MonthlySummaryInput): Promise<MonthlySummary>{
    const startDate = new Date(data.year, data.month - 1, 1);
    const endDate = new Date(data.year, data.month, 1);

    const incomeResult = await getTransactionTotal({
        userId: data.userId,
        type: "INCOME",
        startDate,
        endDate,
    });
    const income = Number(incomeResult[0].total ?? 0);

    const expenseResult = await getTransactionTotal({
        userId: data.userId,
        type: "EXPENSE",
        startDate,
        endDate,
    });
    const expense = Number(expenseResult[0].total ?? 0);
    const balance = income - expense;

    return {income, expense, balance}
}

export async function handleCategoryTransactions(data: CategorySummaryInput): Promise<CategorySummaryResponse[]> {
    const startDate = new Date(data.year, data.month - 1, 1);
    const endDate = new Date(data.year, data.month, 1);

    const result = await getCategoryTransactions({userId: data.userId, startDate, endDate})

    return result.map(toCategorySummaryResponse);
}