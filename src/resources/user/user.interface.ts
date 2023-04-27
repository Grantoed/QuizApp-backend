import { Document } from 'mongoose';
import { QuizQuestion, IncorrectAnswer } from '../solve/solve.interface';

export default interface User extends Document {
    email: string;
    name: string;
    password: string;
    avatarURL: string;
    quizQuestions: QuizQuestion[] | [];
    incorrectAnswers: IncorrectAnswer[] | [];
    solvedQuizes: string[];
    accessToken: string;
    refreshToken: string;

    isValidPassword(password: string): Promise<Error | boolean>;
}
