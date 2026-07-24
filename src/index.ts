import express from "express";
import authRoutes from "./routes/auth";
import categoryRoutes from "./routes/categories"
import {authMiddleware} from "./middleware/auth";

const app = express();

app.use(express.json());
app.use("/v1/auth", authRoutes);
app.use(authMiddleware);
app.use("/v1/categories", categoryRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "SmartBudget API is running"
    });
});

app.listen(3000);