import { useMemo } from 'react';
import { bind } from '@react-rxjs/core';
import { useHangmanContext } from '../HangmanContext';

export const Keyboard = () => {
  const hangman = useHangmanContext();

  const { useCorrectLetters, useWrongLetters } = useMemo(() => {
    const [useWrongLetters] = bind(hangman.wrongLetters$);
    const [useCorrectLetters] = bind(hangman.correctLetters$);

    return {
      useWrongLetters,
      useCorrectLetters,
    };
  }, [hangman]);

  const alphabet = hangman.getAlphabet();
  const correctLetters = useCorrectLetters();
  const wrongLetters = useWrongLetters();

  return (
    <div>
      <ul>
        {alphabet.map((letter) => (
          <Letter
            key={letter}
            value={letter}
            onClick={hangman.submitLetter}
            status={computeLetterStatus(letter, correctLetters, wrongLetters)}
          />
        ))}
      </ul>
    </div>
  );
};

const computeLetterStatus = (
  letter: string,
  correctLetters: Set<string>,
  wrongLetters: Set<string>
): LetterState => {
  return correctLetters.has(letter)
    ? 'correct'
    : wrongLetters.has(letter)
    ? 'wrong'
    : 'undecided';
};

type LetterState = 'undecided' | 'correct' | 'wrong';

interface LetterProps {
  status: LetterState;
  value: string;
  onClick: (letter: string) => void;
}

const Letter = ({ onClick, status, value }: LetterProps) => {
  return (
    <button
      className={`keyboard-letter ${status}`}
      type="button"
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  );
};
