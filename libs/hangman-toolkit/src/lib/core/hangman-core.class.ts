import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { GameState } from './hangman-core.types';

/**
 * The core of the application. This class handles the internal details
 * of the game, such as remaining lives, correct/incorrect letters, the
 * alphabet, and computes the game state
 */
export class HangmanCore {
  private readonly gameStateSubject = new BehaviorSubject<GameState>({
    status: 'playing',
    wrongLetters: new Set(),
    correctLetters: new Set(),
    remainingLives: this.initialLives,
  });
  private readonly lettersRequiredToGuess: number;

  public readonly gameState$ = this.gameStateSubject.asObservable().pipe(
    map(({ status }) => status),
    distinctUntilChanged()
  );

  public readonly lives$ = this.gameStateSubject.asObservable().pipe(
    map(({ remainingLives }) => remainingLives),
    distinctUntilChanged()
  );

  public readonly correctLetters$ = this.gameStateSubject.asObservable().pipe(
    map(({ correctLetters }) => new Set(correctLetters)),
    distinctUntilChanged(
      ({ size: sizePrev }, { size: sizeCurr }) => sizePrev === sizeCurr
    )
  );

  public readonly wrongLetters$ = this.gameStateSubject.asObservable().pipe(
    map(({ wrongLetters }) => new Set(wrongLetters)),
    distinctUntilChanged(
      ({ size: sizePrev }, { size: sizeCurr }) => sizePrev === sizeCurr
    )
  );

  constructor(
    private readonly alphabet: string[],
    private readonly initialLives: number,
    private readonly wordToGuess: string
  ) {
    if (initialLives <= 0) {
      throw new Error(
        `Lives must be a positive number higher than 0. Received ${initialLives}`
      );
    }

    if (wordToGuess.length === 0) {
      throw new Error('The wordToGuess must be of at least lenght 1');
    }

    const wordContainedInAlphabet = wordToGuess
      .split('')
      .every((letter) => alphabet.includes(letter));

    if (!wordContainedInAlphabet) {
      throw new Error(
        `The provided alphabet doesn't contain every letter of the given word.`
      );
    }

    this.lettersRequiredToGuess = new Set(wordToGuess.split('')).size;
  }

  public getAlphabet(): string[] {
    return this.alphabet;
  }

  public getWordToGuess(): string {
    return this.wordToGuess;
  }

  public submitLetter(letterCandidate: string): void {
    if (letterCandidate.length !== 1) {
      throw new Error(
        `Expected a one-letter string. Received ${letterCandidate}`
      );
    }

    if (!this.alphabet.includes(letterCandidate)) {
      throw new Error(
        `The submtited letter is not part of the accepted alphabet`
      );
    }

    const { correctLetters, remainingLives, status, wrongLetters } =
      this.gameStateSubject.getValue();

    if (remainingLives <= 0) {
      throw new Error(
        'You do not have enough lives left to submit a new letter.'
      );
    }

    if (status !== 'playing') {
      throw new Error(
        `The game must be in playing status to submit a new letter. Current status is ${status}`
      );
    }

    if (
      correctLetters.has(letterCandidate) ||
      wrongLetters.has(letterCandidate)
    ) {
      throw new Error('This letter has already been submitted');
    }

    const isLetterCorrect = this.wordToGuess.includes(letterCandidate);

    isLetterCorrect
      ? correctLetters.add(letterCandidate)
      : wrongLetters.add(letterCandidate);

    const newGameState: GameState = {
      correctLetters,
      remainingLives,
      status,
      wrongLetters,
    };

    if (correctLetters.size === this.lettersRequiredToGuess) {
      newGameState.status = 'win';
    } else if (!isLetterCorrect) {
      const newRemainingLives = remainingLives - 1;
      if (newRemainingLives === 0) {
        newGameState.status = 'loss';
      }
      newGameState.remainingLives = newRemainingLives;
    }

    this.gameStateSubject.next(newGameState);

    if (newGameState.status !== 'playing') {
      this.gameStateSubject.complete();
    }
  }
}
