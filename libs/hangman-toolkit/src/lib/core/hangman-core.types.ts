export type GameStatus = 'playing' | 'win' | 'loss';

export interface GameState {
  status: GameStatus;
  correctLetters: Set<string>;
  wrongLetters: Set<string>;
  remainingLives: number;
}
