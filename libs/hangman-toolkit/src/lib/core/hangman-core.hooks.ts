import { useContext, useMemo } from 'react';
import { HangmanContext } from './hangman-core.context';
import { bind } from '@react-rxjs/core';

export const useHangmanContext = () => {
  const ctx = useContext(HangmanContext);

  if (ctx === null) {
    throw new Error(
      'No value for HangmanContext was provided. Please create a new value'
    );
  }

  return ctx;
};

export const useHangmanCorrectLetters = () => {
  const ctx = useHangmanContext();

  const [useCorrectLettersInternal] = useMemo(
    () => bind(ctx.correctLetters$),
    [ctx]
  );

  return useCorrectLettersInternal();
};

export const useHangmanWrongLetters = () => {
  const ctx = useHangmanContext();

  const [useWrongLettersInternal] = useMemo(
    () => bind(ctx.wrongLetters$),
    [ctx]
  );

  return useWrongLettersInternal();
};

export const useHangmanGameState = () => {
  const ctx = useHangmanContext();

  const [useGameStateInternal] = useMemo(() => bind(ctx.gameState$), [ctx]);

  return useGameStateInternal();
};

export const useHangmanCurrentLives = () => {
  const ctx = useHangmanContext();

  const [useCurrentLivesInternal] = useMemo(() => bind(ctx.lives$), [ctx]);

  return useCurrentLivesInternal();
};

export const useHangmanAlphabet = () => {
  const ctx = useHangmanContext();

  return ctx.getAlphabet();
};

export const useHangmanWordToGuess = () => {
  const ctx = useHangmanContext();

  return ctx.getWordToGuess();
};
