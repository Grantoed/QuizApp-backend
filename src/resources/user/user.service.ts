import { Types } from 'mongoose';
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
    ): Promise<string | Error> {
        const existingUser = await this.user.findOne({ email });
        if (existingUser) {
            throw new HttpException(409, `User with email: ${email} already exists`);
        }
        const user = await this.user.create({ name, email, password, role });
        const accessToken = token.createToken(user);
        return accessToken;
    }

    /**
     * Attempt to login a user
     */
    public async login(email: string, password: string): Promise<string | Error> {
        const user = await this.user.findOne({ email });
        if (!user) {
            throw new HttpException(401, 'Unable to find user with that email address');
        }

        if (await user.isValidPassword(password)) {
            return token.createToken(user);
        } else {
            throw new HttpException(401, 'Wrong email or password');
        }
    }

    /**
     * Return current user info
     */
    public async current(userId: string): Promise<User> {
        const userObjectId = new Types.ObjectId(userId);
        const user = await this.user.findOne({ _id: userObjectId });
        if (!user) {
            throw new HttpException(404, `No user with email ${userObjectId} was found`);
        }
        return user;
    }
}

export default UserService;
