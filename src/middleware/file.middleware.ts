import { Request } from 'express';
import path from 'path';
import multer, { StorageEngine } from 'multer';

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
});

export default fileMiddleware;
