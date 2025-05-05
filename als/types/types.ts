import { CategoryStat } from '@prisma/client';
interface ICategory {
    id: string;
    name: string;
    description: string;
    image?: string;
    quizzes: IQuiz[];
}

interface IQuiz {
    id: string;
    title: string;
    description?: string | null;
    image?: string | null;
    categoryId: string | null;
    questions: IQuestion[];
}

interface IQuestion {
    id?: string;
    text: string;
    difficulty?: string | null;
    options: IOption[];   
}

interface IResponse {
    questionId?: string;
    optionId: string;
    isCorrect: boolean;
}

interface IOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface IGameCategory {
    id: string;
    name: string;
    description: string;
    image?: string;
    games?: IGame[];
  }
  
  export interface IGame {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    image?: string;
  }

export type { ICategory, IQuiz, IQuestion, IOption, IResponse, CategoryStat};