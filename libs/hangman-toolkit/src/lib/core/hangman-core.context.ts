import { createContext } from 'react';
import { HangmanCore } from './hangman-core.class';

export const HangmanContext = createContext<HangmanCore | null>(null);

export const HangmanProvider = HangmanContext.Provider;
