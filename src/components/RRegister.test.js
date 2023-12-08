import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RRegister from './RRegister';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

global.fetch = jest.fn();

describe('RRegister Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should register a user successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ status: "success" })
    });
    render(
      <BrowserRouter>
        <RRegister />
      </BrowserRouter>
    );
    await act(async () => {
    // Simulate user input
    userEvent.type(screen.getByPlaceholderText('Username'), 'NewUser23');
    userEvent.type(screen.getByPlaceholderText('Email'), 'newuser23@example.com');
    userEvent.type(screen.getByPlaceholderText('Date of Birth'), '2000-01-01');
    userEvent.type(screen.getByPlaceholderText('Phone'), '1234567890');
    userEvent.type(screen.getByPlaceholderText('Address'), '123 Main St');
    userEvent.type(screen.getByPlaceholderText('Password'), 'passwo3');
    userEvent.type(screen.getByPlaceholderText('Land Size'), '5 acres');
    userEvent.type(screen.getByPlaceholderText('Village Name'), 'Springfield');

    // You can also simulate file input if necessary

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    });

    // Assertions
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/register', 
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData)
        })
      );
      // Here you can add more assertions, like checking if navigation to '/' occurred
    });
  });

  // Additional tests can be written for invalid input, failed registration attempts, etc.
});
