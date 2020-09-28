export interface AdventureInt {
  status: string;
  message: string;
  exits: Array<string>;
  description: string;
  mazeExitDirection: string;
  mazeExitDistance: number;
  locationPath: string;
}
