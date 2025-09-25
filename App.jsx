import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { WalletContextProvider } from './context/WalletContext';
import { BorrowProvider } from './context/BorrowContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <WalletContextProvider>
        <BorrowProvider>
          <AppRoutes />
        </BorrowProvider>
      </WalletContextProvider>
    </BrowserRouter>
  );
}

export default App;
