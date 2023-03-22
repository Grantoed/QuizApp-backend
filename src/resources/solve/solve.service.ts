import { Types } from 'mongoose';
import HttpException from '@/utils/exceptions/http.exception';
import setModel from '../set/set.model';
import userModel from '../user/user.model';
import Set from '../set/set.interface';
import { QuizQuestion, IncorrectAnswer } from './solve.interface';
import shuffle from '../../helpers/shuffle.helper';

class SolveService {
    private set = setModel;
    private user = userModel;

    public async startSet(setId: string, userId: Types.ObjectId): Promise<QuizQuestion[]> {
        const quizQuestions: QuizQuestion[] = [];
        const set: Set | null = await this.set.findById(setId);
        if (!set) {
            throw new HttpException(404, `Set with id ${setId} doesn't exist`);
        }

        const cards = [...set.cards];
        const quizCards = [...cards];
        shuffle(quizCards);

        quizCards.forEach(card => {
            const options = [];
            options.push(card.definition);

            if (quizCards.length > 4) {
                while (options.length < 4) {
                    const randomCard = cards[Math.floor(Math.random() * cards.length)];
                    if (randomCard !== card) {
                        const randomOption = randomCard.definition;
                        if (!options.includes(randomOption)) {
                            options.push(randomOption);
                        }
                    }
                }
            } else {
                while (options.length < quizCards.length) {
                    const randomCard = cards[Math.floor(Math.random() * cards.length)];
                    if (randomCard !== card) {
                        const randomOption = randomCard.definition;
                        if (!options.includes(randomOption)) {
                            options.push(randomOption);
                        }
                    }
                }
            }

            shuffle(options);
            const correctIndex = options.findIndex(option => option === card.definition);
            const quizQuestionItem = {
                term: card.term,
                options: options,
                correctIndex: correctIndex,
            };

            quizQuestions.push(quizQuestionItem);
        });

        await this.user.findOneAndUpdate(
            {
                _id: userId,
            },
            {
                $set: {
                    quizQuestions: quizQuestions,
                },
            },
        );

        return quizQuestions;
    }

    public async checkCardAnswer(
        term: string,
        selectedOption: string,
        userId: Types.ObjectId,
    ): Promise<boolean> {
        let isCorrectAnswer: boolean = false;
        let incorrectAnswer: IncorrectAnswer | null = null;
        const user = await this.user.findOne({ _id: userId });
        if (!user) {
            throw new HttpException(404, `User doesn't exist`);
        }
        for (let i = 0; i < user.quizQuestions.length; i++) {
            const question = user.quizQuestions[i];
            if (question.term === term) {
                const selectedOptionIndex = question.options.indexOf(selectedOption);
                const correctOptionIndex = question.correctIndex;
                isCorrectAnswer = selectedOptionIndex === correctOptionIndex;
                if (!isCorrectAnswer) {
                    incorrectAnswer = {
                        term: question.term,
                        selectedOption,
                        correctOption: question.options[correctOptionIndex],
                    };
                } else {
                    break;
                }
            }
        }
        if (incorrectAnswer) {
            user.incorrectAnswers = [...user.incorrectAnswers, incorrectAnswer];
        }
        await user.save();
        return isCorrectAnswer;
    }

    public async submitSet(setId: string, userId: Types.ObjectId): Promise<IncorrectAnswer[]> {
        const user = await this.user.findOne({ _id: userId });
        if (!user) {
            throw new HttpException(404, `User doesn't exist`);
        }
        const incorrectAnswers = [...user.incorrectAnswers];

        user.solvedQuizes = [...user.solvedQuizes, setId];
        user.quizQuestions = [];
        user.incorrectAnswers = [];
        user.save();
        return incorrectAnswers;
    }
}

export default SolveService;
