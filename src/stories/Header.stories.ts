import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Header } from './Header';

const meta = {
  title: 'Example/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  // Use action() instead of fn()
  args: {
    onLogin: action('onLogin'),
    onLogout: action('onLogout'),
    onCreateAccount: action('onCreateAccount'),
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
};

export const LoggedOut: Story = {};
