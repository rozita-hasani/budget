import express from "express";
import authRoutes from "./features/user/user.routes";
import categoryRoutes from "./features/categories/categories.routes"
import transactionsRoutes from "./features/transactions/transactions.routes";
import summaryRoutes from "./features/summary/summary.routes";
import {authMiddleware} from "./middleware/auth";

const app = express();

app.use(express.json());
app.use("/v1/user", authRoutes);
app.use(authMiddleware);
app.use("/v1/categories", categoryRoutes);
app.use("/v1/transactions", transactionsRoutes);
app.use("/v1/summary", summaryRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "SmartBudget API is running"
    });
});

app.listen(3000);