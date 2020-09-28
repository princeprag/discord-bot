export interface MazeInt {
  name: string;
  mazePath: string;
  startingPosition: string;
  endingPosition: string;
  message: string;
  exampleSolution: { directions: string };
  map: Array<Array<string>>;
}

export interface MazeSolveInt {
  result: string;
  message: string;
  shortestSolutionLength?: number;
  yourSolutionLength?: number;
  elapsed: number;
}
