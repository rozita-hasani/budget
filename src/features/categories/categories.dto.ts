export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface CategoryResponse {
    id: string;
    name: string;
    color: string;
}

export interface CreateCategoryInput {
    name: string;
    color: string;
    userId: string;
}

export interface UpdateCategoryInput {
    id: string;
    name: string;
    color: string;
    userId: string;
}