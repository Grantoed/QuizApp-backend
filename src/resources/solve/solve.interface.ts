export interface QuizQuestion {
    term: string;
    options: string[];
    correctIndex: number;
}

export interface IncorrectAnswer {
    term: string;
    selectedOption: string;
    correctOption: string;
}
