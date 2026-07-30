export interface User {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
}

export interface UserResponse {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
}

export interface CreateUserInput {
    email: string;
    username: string;
    passwordHash: string;
}

export interface RegisterUserInput {
    email: string;
    username: string;
    password: string;
}

export interface LoginUserInput {
    email: string;
    password: string;
}