import { Types } from 'mongoose';
import gravatar from 'gravatar';
import User from './user.interface';
import userModel from './user.model';
import token from '@/utils/token';
import HttpException from '@/utils/exceptions/http.exception';

class UserService {
    private user = userModel;

    /**
     * Register a new user
     */
    public async register(
        name: string,
        email: string,
        password: string,
        role: string,
    ): Promise<User | Error> {
        const avatarURL = gravatar.url('https:' + email);
        const existingUser = await this.user.findOne({ email });
        if (existingUser) {
            throw new HttpException(409, `User with email: ${email} already exists`);
        }
        const user = await this.user.create({ name, email, password, role, avatarURL });
        const accessToken = token.createToken(user);
        const refreshToken = token.createRefreshToken(user);
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();
        return user;
    }

    /**
     * Attempt to login a user
     */
    public async login(email: string, password: string): Promise<User | Error> {
        const user = await this.user.findOne({ email });
        if (!user) {
            throw new HttpException(401, 'Unable to find user with that email address');
        }

        if (await user.isValidPassword(password)) {
            const accessToken = token.createToken(user);
            const refreshToken = token.createRefreshToken(user);
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            await user.save();
            return user;
        } else {
            throw new HttpException(401, 'Wrong email or password');
        }
    }

    /**
     * Log out current user
     */

    public async logout(userId: Types.ObjectId): Promise<Error | void> {
        const user = await this.user.findOneAndUpdate(
            { userId },
            { accessToken: '', refreshToken: '' },
        );
        if (!user) {
            throw new HttpException(401, 'Unable to find user');
        }
        return;
    }

    /**
     * Return current user info
     */
    public async current(userId: string | Types.ObjectId): Promise<User> {
        let user: User | null;
        if (typeof userId === 'string') {
            const userObjectId = new Types.ObjectId(userId);
            user = await this.user.findOne({ _id: userObjectId });
        } else {
            user = await this.user.findOne({ _id: userId });
        }

        if (!user) {
            throw new HttpException(404, `User not found`);
        }
        return user;
    }
}

export default UserService;
