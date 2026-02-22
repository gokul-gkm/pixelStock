import { StatusCodes } from "http-status-codes"
import { AppError } from "./customError.utils"
import bcrypt from "bcryptjs"

export const passwordHash = async (password: string): Promise<string> => {
    try {
        if (!password) {
            throw new AppError("Password didn't react the hashing function", StatusCodes.BAD_REQUEST);
        }
        return await bcrypt.hash(password, 10);
    } catch (error) {
        throw new AppError("Failed to hash password", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}