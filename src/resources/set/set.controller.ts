import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import authMiddleware from '@/middleware/authenticated.middleware';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/set/set.validation';
import SetService from '@/resources/set/set.service';

class SetController implements Controller {
    public path = '/sets';
    public router = Router();
    private SetService = new SetService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(`${this.path}`, this.getAll);
        this.router.get(`${this.path}/user`, authMiddleware, this.getByUser);
        this.router.get(`${this.path}/:id`, this.getById);
        this.router.post(
            `${this.path}`,
            [authMiddleware, validationMiddleware(validate.createSet)],
            this.create,
        );
        this.router.put(`${this.path}/:id`, authMiddleware, this.updateSet);
        this.router.put(`${this.path}/cards/:id`, authMiddleware, this.updateCard);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.delete);
    }

    private getAll = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const query = req.query.q as string;
            const sets = await this.SetService.getAll(query, page, limit);
            const count = await this.SetService.getCount();
            const totalPages = Math.ceil(count / limit);
            res.status(200).json({ sets, page, limit, count, totalPages });
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };

    private getByUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { _id: userId } = req.user;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const sets = await this.SetService.getByUser(page, limit, userId);
            const count = await this.SetService.getCountByUser(userId);
            const totalPages = Math.ceil(count / limit);
            res.status(200).json({ sets, page, limit, count, totalPages });
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };

    private getById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { id: setId } = req.params;
            const set = await this.SetService.getById(setId);
            res.status(200).json({ set });
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { title, description, cards } = req.body;
            const { _id: userId } = req.user;
            const set = await this.SetService.create(title, description, cards, userId);
            res.status(201).json({ set });
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };

    private updateSet = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { id: setId } = req.params;
            const { title, description } = req.body;
            const { _id: userId } = req.user;

            await this.SetService.updateSet(setId, { title, description }, userId);
            res.status(200).send('Set updated');
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };

    private updateCard = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { id: cardId } = req.params;
            const { term, definition } = req.body;
            const { _id: userId } = req.user;
            // console.log('controller triggered');
            console.log('id', cardId);

            await this.SetService.updateCard(cardId, { term, definition }, userId);
            res.status(200).send('Card updated');
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };

    private delete = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { id: setId } = req.params;
            const { _id: userId } = req.user;
            await this.SetService.delete(setId, userId);
            res.status(204);
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };
}

export default SetController;
