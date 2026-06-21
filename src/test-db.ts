import { db } from "./db";
import { users } from "./db/schema";

async function main() {
    const result = await db
        .insert(users)
        .values({
            email: "john@test.com",
            passwordHash: "fake-password",
            username: "john",
        })
        .returning();

    console.log(result);
}

// main();

async function mainTwo() {
    const result = await db
        .select()
        .from(users);

    console.log(result);
}

// mainTwo();

async function addRosie() {
    const result = await db
        .insert(users)
        .values({
            email: "rosie@gmail.com",
            username: "rosie",
            passwordHash: "fake-password",
        })
        .returning();

    console.log(result);
}

// addRosie();


async function getUsers() {
    const result = await db
        .select()
        .from(users);

    console.log(result);
}

getUsers();