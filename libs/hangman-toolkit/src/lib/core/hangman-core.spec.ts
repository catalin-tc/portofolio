import { distinctUntilChanged, forkJoin, map, reduce, scan, take } from 'rxjs';
import { HangmanCore } from './hangman-core.class';

describe('The HangmanCore class spec', () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const initialLives = 6;
  const wordToGuess = 'catalin';
  const correctLetters = [...new Set(wordToGuess.split(''))];
  const wrongLetters = ['b', 'd', 'e', 'g', 'p', 'u'];
  let hangmanCore: HangmanCore;

  beforeEach(() => {
    hangmanCore = new HangmanCore(alphabet, initialLives, wordToGuess);
  });

  describe('Initialization', () => {
    it('Should correctly initialize the alphabet and wordToGuess', () => {
      expect(hangmanCore.getAlphabet()).toEqual(alphabet);
      expect(hangmanCore.getWordToGuess()).toEqual(wordToGuess);
    });

    it('Should correctly initialize the game state', (done) => {
      forkJoin({
        gameState: hangmanCore.gameState$.pipe(take(1)),
        lives: hangmanCore.lives$.pipe(take(1)),
        correctLetters: hangmanCore.correctLetters$.pipe(take(1)),
        wrongLetters: hangmanCore.wrongLetters$.pipe(take(1)),
      }).subscribe({
        next: ({ correctLetters, gameState, lives, wrongLetters }) => {
          expect(correctLetters.size).toEqual(0);
          expect(wrongLetters.size).toEqual(0);
          expect(gameState).toEqual('playing');
          expect(lives).toEqual(6);
        },
        complete: () => done(),
      });
    });

    it('Should throw an error if you pass 0 or less initial lives', () => {
      expect(() => new HangmanCore(alphabet, 0, wordToGuess)).toThrowError();
      expect(() => new HangmanCore(alphabet, -1, wordToGuess)).toThrowError();
    });

    it('Should throw an error if you pass an empty wordToGuess', () => {
      expect(() => new HangmanCore(alphabet, 1, '')).toThrowError();
    });

    it('Should throw an error if there are letters in word not in alphabet', () => {
      expect(() => new HangmanCore(alphabet, 0, 'cătălin')).toThrowError();
    });
  });

  describe('Submission errors', () => {
    it('Should throw if you submit an empty string', () => {
      expect(() => hangmanCore.submitLetter('')).toThrowError();
    });

    it('Should throw if you submit a string longer than 1 letter', () => {
      expect(() => hangmanCore.submitLetter('ab')).toThrowError();
      expect(() => hangmanCore.submitLetter('abc')).toThrowError();
      expect(() => hangmanCore.submitLetter('abcd')).toThrowError();
    });

    it('Should throw if the alphabet does not include the submitted letter', () => {
      expect(() => hangmanCore.submitLetter('ă')).toThrowError();
      expect(() => hangmanCore.submitLetter('â')).toThrowError();
    });

    it('Should throw if the player has 0 or less lives', () => {
      hangmanCore = new HangmanCore(alphabet, 1, 'abc');
      hangmanCore.submitLetter('d');
      expect(() => hangmanCore.submitLetter('e')).toThrowError();
    });

    it('Should throw if the status is `win`', () => {
      hangmanCore = new HangmanCore(alphabet, 1, 'a');
      hangmanCore.submitLetter('a');
      expect(() => hangmanCore.submitLetter('e')).toThrowError();
    });

    it('Should throw if the status is `lose`', () => {
      hangmanCore = new HangmanCore(alphabet, 1, 'a');
      hangmanCore.submitLetter('e');
      expect(() => hangmanCore.submitLetter('f')).toThrowError();
    });

    it('Should throw if the letter was correctly submitted before', () => {
      hangmanCore = new HangmanCore(alphabet, 1, 'ab');
      hangmanCore.submitLetter('a');
      expect(() => hangmanCore.submitLetter('a')).toThrowError();
    });

    it('Should throw if the letter was incorrectly submitted before', () => {
      hangmanCore = new HangmanCore(alphabet, 5, 'ab');
      hangmanCore.submitLetter('c');
      expect(() => hangmanCore.submitLetter('c')).toThrowError();
    });
  });

  describe('Submissions', () => {
    it('Should emit a new correctLetter state on every correct submission', (done) => {
      hangmanCore.correctLetters$
        .pipe(
          map((x) => x.size),
          reduce((emissions) => ++emissions, 0)
        )
        .subscribe({
          next: (emissions) => {
            expect(emissions).toEqual(correctLetters.length + 1);
            done();
          },
        });
      correctLetters.forEach((letter) => hangmanCore.submitLetter(letter));
    });

    it('Should emit a new wrongLetter state on every wrong submission', (done) => {
      hangmanCore.wrongLetters$
        .pipe(
          map((x) => x.size),
          reduce((acc) => ++acc, 0)
        )
        .subscribe({
          next: (emissions) => {
            expect(emissions).toEqual(wrongLetters.length + 1);
            done();
          },
        });
      wrongLetters.forEach((letter) => hangmanCore.submitLetter(letter));
    });

    it('Should add a letter to the correct letters array on correct submission', (done) => {
      hangmanCore.correctLetters$
        .pipe(
          map((x) => x.size),
          scan((prev, curr) => {
            expect(prev + 1).toEqual(curr);
            return curr;
          })
        )
        .subscribe({
          complete: () => done(),
        });
      correctLetters.forEach((letter) => hangmanCore.submitLetter(letter));
    });

    it('Should add a letter to the wrong letters array on wrong submission', (done) => {
      hangmanCore.wrongLetters$
        .pipe(
          map((x) => x.size),
          scan((prev, curr) => {
            expect(prev + 1).toEqual(curr);
            return curr;
          })
        )
        .subscribe({
          complete: () => done(),
        });
      wrongLetters.forEach((letter) => hangmanCore.submitLetter(letter));
    });

    it('Should decrement the life on wrong letter submission', (done) => {
      hangmanCore.lives$
        .pipe(
          scan((prev, curr) => {
            expect(prev - 1).toEqual(curr);
            return curr;
          })
        )
        .subscribe({
          complete: () => done(),
        });
      wrongLetters.forEach((letter) => hangmanCore.submitLetter(letter));
    });

    it('Should change the state to `win` upon guessing all letters', (done) => {
      hangmanCore.gameState$.pipe(distinctUntilChanged()).subscribe({
        next: (status) => expect(status).toEqual('win'),
        complete: () => done(),
      });
      correctLetters.forEach((letter) => hangmanCore.submitLetter(letter));
    });

    it('Should change the state to `loss` upon losing all lives', (done) => {
      hangmanCore.gameState$.pipe(distinctUntilChanged()).subscribe({
        next: (status) => expect(status).toEqual('loss'),
        complete: () => done(),
      });
      wrongLetters.forEach((letter) => hangmanCore.submitLetter(letter));
    });
  });
});
