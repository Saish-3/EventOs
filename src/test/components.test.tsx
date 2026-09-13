import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Dashboard from '@/app/dashboard/page';
import Copilot from '@/app/copilot/page';
import Food from '@/app/food/page';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes('/api/attendee/copilot')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            text: 'I recommend your next AI session based on your interests and available time.',
            items: [],
          },
        }),
      } as Response);
    }

    if (url.includes('/api/food/order')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: 'ORD-123',
            item: { name: 'Paneer Power Bowl', slot: '12:40–12:50' },
            slot: '12:40–12:50',
            status: 'PLACED',
          },
        }),
      } as Response);
    }

    return Promise.resolve({ ok: true, json: async () => ({ success: true, data: [] }) } as Response);
  }));
});

describe('components', () => {
  it('shows the dashboard recommendations and opens COPILOT in the UI', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Good morning/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ask EventOS/i })).toHaveAttribute('href', '/copilot');
  });

  it('sends the copilot message and announces the result', async () => {
    render(<Copilot />);
    const input = screen.getByLabelText(/your message/i);
    fireEvent.change(input, { target: { value: 'What should I attend next?' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/I recommend your next AI session/i)).toBeInTheDocument();
    });
  });

  it('allows ordering a food slot and shows the resulting order state', async () => {
    render(<Food />);
    const button = screen.getByRole('button', { name: /reserve paneer power bowl/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Order ORD-123 placed/i)).toBeInTheDocument();
    });
  });
});
