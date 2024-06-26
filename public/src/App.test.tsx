import React from 'react';
import { render, screen } from '@testing-library/react';
import Kakeibo from './Kakeibo';

test('renders learn react link', () => {
  render(<Kakeibo />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
