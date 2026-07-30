import {User, UserResponse} from "./user.dto";

export function toUserResponse(user:User): UserResponse {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
    }
}