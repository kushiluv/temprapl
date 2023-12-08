import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import Market from './Market';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe('Market Component', () => {
  it('fetches and displays products', async () => {

    fetch.mockResolvedValueOnce({
        ok: false,
    });
    fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
        { _id: '1', title: 'wheat', price: 100, coverImg: 'url1' },
        ]),
    });

    render(
      <BrowserRouter>
        <Market />
      </BrowserRouter>
    );

    // Wait for a specific product to be displayed
    // Replace 'Specific Product Title' with a title you expect to be fetched
    await waitFor(() => {
      expect(screen.getByText('wheat')).toBeInTheDocument();
    });
  });

  // ... other tests
});
