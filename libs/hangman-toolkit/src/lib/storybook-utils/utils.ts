import { HangmanCore } from '../core/hangman-core.class';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const initialLives = 6;

export function createShowcaseHangmanCore(wordToGuess: string) {
  return new HangmanCore(alphabet, initialLives, wordToGuess);
}
