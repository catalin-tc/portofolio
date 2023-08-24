import type { Meta, StoryObj } from '@storybook/react';
import { Keyboard } from './Keyboard';

const meta: Meta<typeof Keyboard> = {
  component: Keyboard,
  title: 'Keyboard',
};
export default meta;
type Story = StoryObj<typeof Keyboard>;

export const Primary = {
  args: {},
};
