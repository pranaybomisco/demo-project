import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../redux/store.js';
import { ThemeProvider } from './providers/themeprovider.jsx';
import { AuthProvider } from './providers/authprovider.jsx';
import { ToastProvider } from './providers/toastprovider.jsx';
import { RoutePreloader } from '../views/components/routepreloader.jsx';
import { TelemetryOverlay } from '../views/components/telemetryoverlay.jsx';
import { AppRouter } from '../routers/approuter.jsx';

export const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <ToastProvider>
              <RoutePreloader />
              {/* <TelemetryOverlay /> */}
              <AppRouter />
            </ToastProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

