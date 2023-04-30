import { Router, Request, Response, NextFunction } from 'express';
import SolveService from '@/resources/solve/solve.service';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import authMiddleware from '@/middleware/authenticated.middleware';

class SolveController implements Controller {
    public path = '/solve';
    public router = Router();
    public SolveService = new SolveService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(`${this.path}/:id`, authMiddleware, this.solveQuiz);
        this.router.post(`${this.path}/check`, authMiddleware, this.checkCardAnswer);
        this.router.post(`${this.path}/submit/:id`, authMiddleware, this.submitQuiz);
    }

    private solveQuiz = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            if (req.user) {
                const { id: setId } = req.params;
                const { _id: userId } = req.user;
                const quizQuestions = await this.SolveService.startSet(setId, userId);
                res.status(200).json({ quizQuestions });
            }
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };

    private checkCardAnswer = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            if (req.user) {
                const { _id: userId } = req.user;
                const { term, selectedOption } = req.body;
                const isCorrectAnswer = await this.SolveService.checkCardAnswer(
                    term,
                    selectedOption,
                    userId,
                );
                res.status(200).json({ isCorrectAnswer });
            }
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };

    private submitQuiz = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            if (req.user) {
                const { id: setId } = req.params;
                const { _id: userId } = req.user;
                const incorrectAnswers = await this.SolveService.submitSet(setId, userId);
                res.status(200).json({ incorrectAnswers });
            }
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };
}

export default SolveController;
