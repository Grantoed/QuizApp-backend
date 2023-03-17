import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import { uploadFile } from '../../aws/s3';
import FileService from './file.service';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import uploadMiddleware from '@/middleware/file.middleware';
import authMiddleware from '@/middleware/authenticated.middleware';
import validationMiddleware from '@/middleware/validation.middleware';

class FilesController implements Controller {
    public path = '/files';
    public router = Router();
    public FileService = new FileService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/user/upload/:id`,
            [authMiddleware, uploadMiddleware],
            this.uploadAvatar,
        );
    }

    private uploadAvatar = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const file = req.file;
            const { _id: userId } = req.user;
            if (!file) {
                return next(new HttpException(400, 'No file provided'));
            }
            const result = await uploadFile(file);
            await fs.unlink(file.path);
            console.log(result);
            const avatarURL = await this.FileService.updateAvatar(result.Location, userId);
            res.status(200).json({ avatarURL });
            next();
        } catch (e: any) {
            next(new HttpException(e.status, e.message));
        }
    };
}

export default FilesController;
