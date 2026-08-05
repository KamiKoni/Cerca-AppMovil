import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react-native';
import { SignInScreen } from './SignInScreen';

vi.mock('../infrastructure/api', () => ({
  signIn: vi.fn(async () => ({ accessToken: 'token', refreshToken: 'refresh', actor: { id: 'user-1', capacities: ['customer'], platformRole: 'user' } })),
}));

describe('SignInScreen', () => {
  it('renders and submits credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByText('Sign in'));

    expect(getByText('Signing in...')).toBeTruthy();
  });
});
