import {
  useHangmanContext,
  useHangmanCorrectLetters,
  useHangmanWrongLetters,
} from '../../core/hangman-core.hooks';
import './Keyboard.scss';

export const Keyboard = () => {
  const hangmanCtx = useHangmanContext();

  const alphabet = hangmanCtx.getAlphabet();
  const correctLetters = useHangmanCorrectLetters();
  const wrongLetters = useHangmanWrongLetters();

  return (
    <div className="keyboard">
      <ul className="keyboard--keys-list">
        {alphabet.map((letter) => (
          <Letter
            key={letter}
            value={letter}
            onClick={() => hangmanCtx.submitLetter(letter)}
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
  onClick: () => void;
}

const Letter = ({ onClick, status, value }: LetterProps) => {
  return (
    <li className="keyboard--key">
      <button
        disabled={status !== 'undecided'}
        className={`keyboard--letter ${status}`}
        type="button"
        onClick={onClick}
      >
        {value}
      </button>
    </li>
  );
};
