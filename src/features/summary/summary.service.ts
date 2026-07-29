import {getCategoryTransactions, getTransactionTotal} from "./summary.repository";

export async function calculateMonthlySummary(data: {
    userId: string;
    year: number;
    month: number;
}){
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

export async function handleCategoryTransactions(data: {
    userId: string;
    year: number;
    month: number;
}) {
    const startDate = new Date(data.year, data.month - 1, 1);
    const endDate = new Date(data.year, data.month, 1);

    return getCategoryTransactions({userId: data.userId, startDate, endDate})

}