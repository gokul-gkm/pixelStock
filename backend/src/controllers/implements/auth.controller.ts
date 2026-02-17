import { Request, Response } from "express";
import { IAuthController } from "../interfaces/auth.Icontroller";
import Container, { Service } from "typedi";
import { StatusCodes } from "http-status-codes";


@Service()
export class AuthController implements IAuthController {
    constructor() {  
        
    }
    
}

export const authController = Container.get(AuthController);