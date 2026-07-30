import {Category, CategoryResponse} from "./categories.dto";

export function toCategoryResponse(category : Category): CategoryResponse {
    return {
        id: category.id,
        name: category.name,
        color: category.color,
    }
}