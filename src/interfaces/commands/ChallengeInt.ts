export interface ChallengeStartInt {
  message: string;
  nextQuestion: string;
}

export interface ChallengeSolveInt {
  result: string;
  message: string;
  nextQuestion: string;
}

interface ChallengeInt {
  [key: string]: string;
}

export default ChallengeInt;
