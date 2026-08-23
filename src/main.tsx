import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './graphql/client';
import { App } from './App';
import { Toaster } from 'react-hot-toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#141414',
            color: '#f5f0e6',
            border: '1px solid #2a2a2a',
            fontSize: '13px',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#d4a017',
              secondary: '#000000',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </ApolloProvider>
  </React.StrictMode>
);
