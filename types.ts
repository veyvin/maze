export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean; // Used during generation
}

export type MazeGrid = Cell[][];

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface GameState {
  level: number;
  width: number;
  height: number;
  playerPos: Position;
  goalPos: Position;
  isFinished: boolean;
  viewRadius: number;
  moveCount: number;
  showMist: boolean;
  difficulty: Difficulty;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon?: string;
}

export interface GameStats {
  totalMoves: number;
  levelsCompleted: number;
  hardLevelsCompleted: number;
}