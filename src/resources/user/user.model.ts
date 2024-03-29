import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import User from './user.interface';

const userSchema = new Schema(
    {
        googleId: {
            type: String,
            required: false,
        },

        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
        },

        role: {
            type: String,
            default: 'user',
        },

        avatarURL: {
            type: String,
        },

        quizQuestions: {
            type: Array,
        },

        incorrectAnswers: {
            type: Array,
        },

        solvedQuizes: {
            type: Array,
        },

        accessToken: {
            type: String,
        },

        refreshToken: {
            type: String,
        },
    },
    { timestamps: true },
);

userSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

userSchema.methods.isValidPassword = async function (password: string): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
};

const userModel = model<User>('User', userSchema);
export default userModel;
