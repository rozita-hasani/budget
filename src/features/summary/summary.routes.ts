import express from 'express'
import {calculateMonthlySummary, handleCategoryTransactions} from "./summary.service";

const router = express.Router();

/**
 * @openapi
 * /v1/summary/monthly:
 *   get:
 *     tags:
 *       - Summary
 *     summary: Get monthly income, expense and balance summary
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2026
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 7
 *     responses:
 *       200:
 *         description: Monthly financial summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 income:
 *                   type: number
 *                   example: 2500
 *                 expense:
 *                   type: number
 *                   example: 1200
 *                 balance:
 *                   type: number
 *                   example: 1300
 *       401:
 *         description: Unauthorized
 */
router.get("/monthly", async (req, res) => {    const userId = req.user!.userId;
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    const result = await calculateMonthlySummary({userId, year, month});

    return res.json(result);
});

/**
 * @openapi
 * /v1/summary/by-category:
 *   get:
 *     tags:
 *       - Summary
 *     summary: Get expense summary grouped by category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2026
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 7
 *     responses:
 *       200:
 *         description: Expenses grouped by category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                     example: Food
 *                   total:
 *                     type: number
 *                     example: 350
 *       401:
 *         description: Unauthorized
 */
router.get("/by-category", async (req, res) => {    const userId = req.user!.userId;
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    const result = await handleCategoryTransactions({userId, year, month})

    return res.json(result);
})

export default router;