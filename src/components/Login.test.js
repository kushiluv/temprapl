import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';

// Mocking the navigate function from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mocking fetchd
global.fetch = jest.fn();

describe('Login Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should login successfully', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'mkaif@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'passw' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));


    // Assertions
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: 'mkaif@gmail.com', password: 'passw' }),
      });

      // You can add more assertions here, for example, to check if navigation has occurred.
    });
  });

  // Additional tests can be written to simulate and assert failed login attempts
});
