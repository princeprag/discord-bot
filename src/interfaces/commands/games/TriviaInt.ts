/* eslint-disable camelcase */
interface ResultInt {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface TriviaInt {
  response_code: number;
  results: ResultInt[];
}
