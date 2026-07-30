import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import {CreateUserInput, User} from "./user.dto";

export function createUser(data: CreateUserInput): Promise<User[]> {
    return db
        .insert(users)
        .values(data)
        .returning();
}

export function findUserByEmail(email: string): Promise<User | undefined> {
    return db.query.users.findFirst({
        where: eq(users.email, email)
    });
}