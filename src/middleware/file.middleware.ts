import { Request, Response, NextFunction } from 'express';
import path from 'path';
import multer, { StorageEngine } from 'multer';
import resizeAndRenameImage from '../helpers/file.helper';
import HttpException from '@/utils/exceptions/http.exception';

const AVATARS_DIR = path.resolve('./tmp');

const storage: StorageEngine = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void,
    ) => {
        cb(null, AVATARS_DIR);
    },
    filename: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void,
    ) => {
        cb(null, file.originalname);
    },
});

const fileMiddleware = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // limit the file size to 5 MB
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
        // check if the file is an image
        if (!file.mimetype.startsWith('image/')) {
            return cb(new HttpException(400, 'Only image files are allowed!'), false);
        }
        cb(null, true);
    },
}).single('avatar');

const uploadMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    fileMiddleware(req, res, async (e: any) => {
        if (e) {
            return next(e);
        }

        // Check if the file exists in the request
        if (!req.file) {
            return next(new HttpException(400, 'No file uploaded'));
        }

        // Resize and rename the file using the resizeAndRenameImage function
        try {
            const { newFileName, newFilePath } = await resizeAndRenameImage(req.file.filename);
            req.file.filename = newFileName;
            req.file.path = newFilePath;
            next();
        } catch (e) {
            return next(new HttpException(500, 'Failed to resize and rename file'));
        }
    });
};

export default uploadMiddleware;
