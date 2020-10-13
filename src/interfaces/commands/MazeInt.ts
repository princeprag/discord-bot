interface MazeInt {
  name: string;
  mazePath: string;
  startingPosition: string;
  endingPosition: string;
  message: string;
  exampleSolution: { directions: string };
  map: string[][];
}

export interface MazeSolveInt {
  result: string;
  message: string;
  shortestSolutionLength?: number;
  yourSolutionLength?: number;
  elapsed: number;
}

export default MazeInt;
