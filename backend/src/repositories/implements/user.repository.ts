import { IUser, User } from "@/models/user.model";
import { IUserRepository } from "../interfaces/user.Irepository";
import { BaseRepository } from "./base.repository";
import { Service } from "typedi";
import { TOKENS } from "@/di/tokens";

@Service({ id: TOKENS.UserRepository })
export class UserRepository extends BaseRepository<IUser> implements IUserRepository{
    constructor() {
        super(User)
    }

    async findByEmail(email: string): Promise<IUser | null | never>{
        try {
            return await User.findOne({email})
        } catch (error) {
          return Promise.reject(new Error(`Error fetching user by email ${error}`));
        }
    }
}