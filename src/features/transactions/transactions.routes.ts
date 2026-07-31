import express from "express";
import {transactionSchema} from "../../validations/transaction";
import {deleteTransaction, getTransactions} from "./transactions.repository";
import {handleCreateTransaction, handleTransactionUpdate} from "./transactions.service";
import {toTransactionListResponse, toTransactionResponse} from "./transactions.mapper";

const router = express.Router();

/**
 * @openapi
 * /v1/transactions:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get user transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of transactions
 *       401:
 *         description: Unauthorized
 */
router.get("/", async (req, res) => {
    const transactions = await getTransactions({
        userId: req.user!.userId,
        type: req.query.type as "INCOME" | "EXPENSE" | undefined,
        categoryId: req.query.categoryId as string | undefined,
    });

    return res.json(transactions.map(toTransactionListResponse));
});

/**
 * @openapi
 * /v1/transactions:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Create a transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - categoryId
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 25.50
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               note:
 *                 type: string
 *                 example: Grocery shopping
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Transaction created
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 */
router.post("/", async (req, res) => {
    const userId = req.user!.userId;
    const result = transactionSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    const transaction = await handleCreateTransaction({...result.data, userId});

    return res.status(201).json(toTransactionResponse(transaction));
});

/**
 * @openapi
 * /v1/transactions/{id}:
 *   put:
 *     tags:
 *       - Transactions
 *     summary: Update a transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - categoryId
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               note:
 *                 type: string
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Transaction updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @openapi
 * /v1/transactions/{id}:
 *   delete:
 *     tags:
 *       - Transactions
 *     summary: Delete a transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Transaction deleted
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */
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