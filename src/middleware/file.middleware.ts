import { Request, Response, NextFunction } from 'express';
import path from 'path';
import multer, { StorageEngine } from 'multer';
import resizeAndRenameImage from '../helpers/file.helper';

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
}).single('avatar');

const uploadMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    fileMiddleware(req, res, async (e: any) => {
        if (e) {
            return res.status(500).json({ message: 'Failed to upload file' });
        }

        // Check if the file exists in the request
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Resize and rename the file using the resizeAndRenameImage function
        try {
            const { newFileName, newFilePath } = await resizeAndRenameImage(req.file.filename);
            req.file.filename = newFileName;
            req.file.path = newFilePath;
            next();
        } catch (e) {
            return res.status(500).json({ message: 'Failed to resize and rename file' });
        }
    });
};

export default uploadMiddleware;
