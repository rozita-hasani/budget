import {db} from "../../db";
import {categories} from "../../db/schema";
import {and, eq} from "drizzle-orm";
import {Category, CreateCategoryInput, UpdateCategoryInput} from "./categories.dto";

export async function createCategory(data: CreateCategoryInput) : Promise<Category[]> {
    return db
        .insert(categories)
        .values(data)
        .returning();
}

export async function getCategories(userId: string) : Promise<Category[]> {
    return db
        .select()
        .from(categories)
        .where(eq(categories.userId, userId))
}

export async function updateCategory(data: UpdateCategoryInput) : Promise<Category[]> {
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

export async function deleteCategory(id: string, userId: string) : Promise<boolean> {
    const deleted = await db
        .delete(categories)
        .where(
            and(
                eq(categories.id, id),
                eq(categories.userId, userId)
            )
        )
        .returning();

    return deleted.length > 0;
}