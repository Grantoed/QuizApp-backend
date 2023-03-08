import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
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
        this.router.get(`${this.path}`, this.get);
        this.router.post(`${this.path}`, validationMiddleware(validate.createSet), this.create);
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { title, description, cards } = req.body;
            const set = await this.SetService.create(title, description, cards);
            res.status(201).json({ set });
        } catch (e) {
            next(new HttpException(400, 'Cannot create set'));
        }
    };

    private get = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const sets = await this.SetService.get();
            res.status(200).json({ sets });
        } catch (e) {
            next(new HttpException(400, 'Cannot get set'));
        }
    };
}

export default SetController;
