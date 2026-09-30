import React from 'react';
import { render } from '@testing-library/react-native';
import { AppProvider, useApp } from '../context/AppContext';
import { ThemeProvider } from '../theme/ThemeContext';

const WhenAppIsReady = ({ children }) => {
  const { loading } = useApp();
  return loading ? null : children;
};

export const renderWithProviders = (ui, options) =>
  render(
    <ThemeProvider>
      <AppProvider>
        <WhenAppIsReady>{ui}</WhenAppIsReady>
      </AppProvider>
    </ThemeProvider>,
    options
  );