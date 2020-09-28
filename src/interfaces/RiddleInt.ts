export interface RiddleStartInt {
  message: string;
  riddlePath: string;
}

export interface RiddleGetInt {
  message: string;
  riddlePath: string;
  exampleResponse: { [key: string]: string };
  riddleType: string;
  riddleText: string;
}

export interface RiddleSolveInt {
  result: string;
  nextRiddlePath: string;
}
