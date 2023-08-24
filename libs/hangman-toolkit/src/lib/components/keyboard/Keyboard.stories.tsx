import type { Meta, StoryObj } from '@storybook/react';
import {
  useHangmanCurrentLives,
  useHangmanWordToGuess,
} from '../../core/hangman-core.hooks';
import { HangmanProviderDecorator } from '../../storybook-utils/utils';
import { Keyboard } from './Keyboard';

export default {
  component: Keyboard,
  title: 'Keyboard',
  decorators: [HangmanProviderDecorator],
} as Meta<typeof KeyboardShowcase>;

const KeyboardShowcase = () => {
  const remainingLives = useHangmanCurrentLives();
  const wordToGuess = useHangmanWordToGuess();

  return (
    <div className="tw-container tw-flex tw-flex-col tw-gap-y-16 tw-text-2xl tw-text-center">
      <h1>{remainingLives} lives remaining</h1>
      <Keyboard />
      <h1>
        Word to guess is: <span className="tw-font-bold">{wordToGuess}</span>
      </h1>
    </div>
  );
};

export const Story: StoryObj<typeof KeyboardShowcase> = {
  render: KeyboardShowcase,
  name: 'Keyboard',
};
