export interface Exam {
  id: number;
  name: string;
  isPublish: boolean;
  isDelete: boolean;
  content: string;
}

export interface ExamAdd {
  name: string;
}

export interface ExamSave {
  id: number;
  content: string;
}

export type QuestionTypes = "radio" | "checkbox" | "input";

export interface Question {
  id: number;
  question: string;
  type: QuestionTypes;
  options?: string[];
  score: number;
  answer: string;
  answerAnalyze: string;
  userAnswer?: string | string[];
}
