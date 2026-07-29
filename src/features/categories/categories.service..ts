import {updateCategory} from "./categories.repository";

export async function handleCategoryUpdate(data: {name: string; color: string, id: string, userId: string}) {
    const updated = await updateCategory(data);

    if (updated.length === 0) {
        throw new Error("Category not found");
    }

    return updated[0];
}

