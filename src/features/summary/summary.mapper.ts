import {CategorySummary, CategorySummaryResponse} from "./summary.dto";

export function toCategorySummaryResponse(summary: CategorySummary): CategorySummaryResponse {
    return {
        category: summary.category,
        total: Number(summary.total ?? 0),
    };
}