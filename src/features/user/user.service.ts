import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "./user.repository";
import {LoginUserInput, RegisterUserInput, User} from "./user.dto";

export async function registerUser(data: RegisterUserInput): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await createUser({
        email: data.email,
        username: data.username,
        passwordHash,
    });

    return user[0];
}

export async function loginUser(data: LoginUserInput): Promise<string> {
    const user = await findUserByEmail(data.email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "24h"
        }
    );

    return token;
}