import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/token';
import userModel from '@/resources/user/user.model';
import Token from '@/utils/interfaces/token.interface';
import HttpException from '@/utils/exceptions/http.exception';
import jwt from 'jsonwebtoken';

async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> {
    try {
        const bearer = req.headers.authorization;

        if (req.session.passport?.user || !bearer) {
            console.log('req.user', req.user);
            return next();
        }

        if (!bearer || !bearer.startsWith('Bearer ')) {
            return next(new HttpException(401, 'Provide a valid token'));
        }

        const accessToken = bearer.split('Bearer ')[1].trim();

        const payload: Token | jwt.JsonWebTokenError = await verifyToken(accessToken);
        if (payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'Invalid token'));
        }
        const user = await userModel.findById(payload.id).select('-password').exec();
        if (!user) {
            return next(new HttpException(404, `User doesn't exist`));
        }

        req.user = user;
        return next();
    } catch (e) {
        return next(new HttpException(401, 'Unauthorized'));
    }
}

export default authMiddleware;
