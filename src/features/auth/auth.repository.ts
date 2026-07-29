import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export function createUser(data: {
    email: string;
    username: string;
    passwordHash: string;
}) {
    return db
        .insert(users)
        .values(data)
        .returning();
}

export function findUserByEmail(email: string) {
    return db.query.users.findFirst({
        where: eq(users.email, email)
    });
}