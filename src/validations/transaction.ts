import {z} from "zod";

export const transactionSchema = z.object({
    amount: z.number().positive("Amount must be greater than 0"),
    type: z.enum(["INCOME", "EXPENSE"]),
    note: z.string().optional(),
    categoryId: z.uuid(),
})