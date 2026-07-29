import express from 'express'
import {calculateMonthlySummary, handleCategoryTransactions} from "./summary.service";

const router = express.Router();

router.get("/monthly", async (req, res) => {
    const userId = req.user!.userId;
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    const result = await calculateMonthlySummary({userId, year, month});

    return res.json(result);
});

router.get("/by-category", async (req, res) => {
    const userId = req.user!.userId;
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    const result = await handleCategoryTransactions({userId, year, month})

    return res.json(result);
})

export default router;