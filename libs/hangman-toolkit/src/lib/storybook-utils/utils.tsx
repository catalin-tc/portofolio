import { Decorator } from '@storybook/react';
import { HangmanCore } from '../core/hangman-core.class';
import { HangmanProvider } from '../core/hangman-core.context';
import { Subscribe } from '@react-rxjs/core';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const initialLives = 6;
const wordToGuess = 'catalin';

export const createShowcaseHangmanCore = () => {
  return new HangmanCore(alphabet, initialLives, wordToGuess);
};

export const HangmanProviderDecorator: Decorator = (Story) => {
  return (
    <HangmanProvider value={createShowcaseHangmanCore()}>
      <Subscribe>
        <Story />
      </Subscribe>
    </HangmanProvider>
  );
};
