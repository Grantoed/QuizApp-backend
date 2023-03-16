import { Document } from 'mongoose';

export default interface User extends Document {
    email: string;
    name: string;
    password: string;
    avatarS3Key: string;

    isValidPassword(password: string): Promise<Error | boolean>;
}
