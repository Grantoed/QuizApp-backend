import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import User from './user.interface';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import authMiddleware from '@/middleware/authenticated.middleware';
import validate from '@/resources/user/user.validation';
import isUser from '@/helpers/isUser.helper';
import UserService from './user.service';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register,
        );
        this.router.post(`${this.path}/login`, validationMiddleware(validate.login), this.login);
        this.router.post(`${this.path}/logout`, this.logout);
        this.router.get(`${this.path}`, authMiddleware, this.getUser);
        this.router.get(`${this.path}/refresh`, this.refreshUser);
        this.router.get(
            `${this.path}/google`,
            passport.authenticate('google', { scope: ['profile', 'email'] }),
        );
        this.router.get(
            `${this.path}/google/callback`,
            passport.authenticate('google', {
                successRedirect: 'http://localhost:3000',
                failureRedirect: 'http://localhost:3000',
            }),
        );
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;
            const user = await this.UserService.register(name, email, password, 'user');
            if (isUser(user)) {
                (req.user as User) = user;
                res.status(201).json(user);
            } else {
                throw user; // re-throw the error
            }
        } catch (e: any) {
            next(e);
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const user = await this.UserService.login(email, password);
            if (isUser(user)) {
                (req.user as User) = user;
                res.status(200).json(user);
            } else {
                throw user; // re-throw the error
            }
        } catch (e: any) {
            next(e);
        }
    };

    private logout = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            if (req.user) {
                const { _id: userId } = req.user;
                await this.UserService.logout(userId);
                res.status(200).send('Logged out successfully');
            }
        } catch (e: any) {
            next(e);
        }
    };

    private getUser = (req: Request, res: Response, next: NextFunction): Response | void => {
        try {
            res.status(200).json({ user: req.user });
        } catch (e: any) {
            next(e);
        }
    };

    private refreshUser = (req: Request, res: Response, next: NextFunction): Response | void => {
        try {
            console.log(req.user);
            res.status(200).json({ user: req.user });
        } catch (e: any) {
            next(e);
        }
    };
}

export default UserController;
