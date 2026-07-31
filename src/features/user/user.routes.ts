import { Router } from "express";
import { loginSchema, registerSchema } from "../../validations/auth";
import { registerUser, loginUser } from "./user.service";
import {toUserResponse} from "./user.mapper";

const router = Router();

/**
 * @openapi
 * /v1/users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 example: john
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post("/register", async (req, res) => {    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    const user = await registerUser(result.data);

    return res.status(201).json(toUserResponse(user));
});

/**
 * @openapi
 * /v1/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIs...
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", async (req, res) => {    const result = loginSchema.safeParse(req.body);

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