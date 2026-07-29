import {db} from "../../db";
import {categories} from "../../db/schema";
import {and, eq} from "drizzle-orm";

export async function createCategory(data: {
    name: string;
    color: string;
    userId: string;
}){
    return db
        .insert(categories)
        .values(data)
        .returning();
}

export async function getCategories(userId: string) {
    return db
        .select()
        .from(categories)
        .where(eq(categories.userId, userId))
}

export async function updateCategory(data: {name: string; color: string, id: string, userId: string}) {
    return db
        .update(categories)
        .set({
            name: data.name,
            color: data.color,
        })
        .where(
            and(
                eq(categories.id, data.id),
                eq(categories.userId, data.userId)
            )
        )
        .returning();
}

export async function deleteCategory(id: string, userId: string) {
    return db
        .delete(categories)
        .where(
            and(
                eq(categories.id, id),
                eq(categories.userId, userId)
            )
        )
        .returning();
}