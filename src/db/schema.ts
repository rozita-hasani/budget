import {pgTable, uuid, text, timestamp, numeric, pgEnum} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    username: text("username").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    color: text("color").notNull(),
    userId: uuid("user_id").notNull().references(()=> users.id),
});

export const transactionsType = pgEnum("transaction_type", [
    "INCOME",
    "EXPENSE"
]);

export const transactions = pgTable("transactions", {
    id: uuid("id").defaultRandom().primaryKey(),
    amount: numeric("amount", {precision: 12, scale:2, mode: "number"}).notNull(),
    type: transactionsType("type").notNull(),
    date: timestamp("date").defaultNow().notNull(),
    note: text("note"),
    categoryId: uuid("category_id").notNull().references(()=>categories.id),
    userId: uuid("user_id").notNull().references(()=> users.id),
});
