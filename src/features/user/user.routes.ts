import { Router } from "express";
import { loginSchema, registerSchema } from "../../validations/auth";
import { registerUser, loginUser } from "./user.service";
import {toUserResponse} from "./user.mapper";

const router = Router();

router.post("/register", async (req, res) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    const user = await registerUser(result.data);

    return res.status(201).json(toUserResponse(user));
});

router.post("/login", async (req, res) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    try {
        const token = await loginUser(result.data);

        return res.json({token});
    } catch(error) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }
});

export default router;