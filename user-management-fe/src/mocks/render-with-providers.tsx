import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

export const queryClient = new QueryClient();
export const renderWithProviders = (ui: ReactNode) => render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);