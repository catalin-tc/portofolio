import { createContext, useContext } from 'react';
import { HangmanCore } from '../core/hangman-core.class';

const HangmanContext = createContext<HangmanCore | null>(null);

export const HangmanProvider = HangmanContext.Provider;
export const useHangmanContext = () => {
  const ctx = useContext(HangmanContext);

  if (ctx === null) {
    throw new Error(
      'No value for HangmanContext was provided. Please create a new value'
    );
  }

  return ctx;
};
