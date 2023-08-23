import { render } from '@testing-library/react';

import HangmangCore from './HangmangCore';

describe('HangmangCore', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HangmangCore />);
    expect(baseElement).toBeTruthy();
  });
});
