import express from "express";
import {transactionSchema} from "../../validations/transaction";
import {deleteTransaction, getTransactions} from "./transactions.repository";
import {handleCreateTransaction, handleTransactionUpdate} from "./transactions.service";
import {toTransactionListResponse, toTransactionResponse} from "./transactions.mapper";

const router = express.Router();

router.get("/", async (req, res) => {
    const transactions = await getTransactions({
        userId: req.user!.userId,
        type: req.query.type as "INCOME" | "EXPENSE" | undefined,
        categoryId: req.query.categoryId as string | undefined,
    });

    return res.json(transactions.map(toTransactionListResponse));
});

router.post("/", async (req, res) => {
    const userId = req.user!.userId;
    const result = transactionSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    const transaction = await handleCreateTransaction({...result.data, userId});

    return res.status(201).json(toTransactionResponse(transaction));
});

router.put("/:id", async (req, res) => {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const result = transactionSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    const updatedTransaction = await handleTransactionUpdate({...result.data, id, userId});

    return res.json(toTransactionResponse(updatedTransaction));
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const deleted = await deleteTransaction(id, userId);

    if (!deleted) {
        return res.status(404).json({message: "Transaction not found"});
    }

    return res.status(204).send();
})

export default router;