import {updateCategory} from "./categories.repository";
import {Category, UpdateCategoryInput} from "./categories.dto";

export async function handleCategoryUpdate(data: UpdateCategoryInput) : Promise<Category> {
    const updated = await updateCategory(data);

    if (updated.length === 0) {
        throw new Error("Category not found");
    }

    return updated[0];
}

