import React, { useContext } from 'react';
import { WalletContext } from '../../context/WalletContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Dashboard = ({ lendingOffers }) => {
  const { walletAddress, balance, connectWallet, disconnectWallet } = useContext(WalletContext);
  const navigate = useNavigate();
  const location = useLocation();
  const submitted = new URLSearchParams(location.search).get('submitted');

  return (
    <div style={containerStyle}>
      {walletAddress && (
        <button onClick={disconnectWallet} style={disconnectButton}>
          Disconnect
        </button>
      )}

      <div style={contentStyle}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>P2P Lending Platform</h1>

        {walletAddress ? (
          <>
            <p style={{ color: 'lightgreen', fontSize: '1.2rem' }}>
              ✅ Connected: {walletAddress}
            </p>
            <p style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
              💰 Wallet Balance: {balance} ETH
            </p>

            {submitted === 'true' && (
              <p style={successBanner}>
                ✅ Borrow request submitted successfully!
              </p>
            )}

            {/* Lending offers section removed to avoid showing on dashboard */}
          </>
        ) : (
          <button onClick={connectWallet} style={connectButton}>
            Connect Wallet
          </button>
        )}
      </div>

      {walletAddress && (
        <div style={navButtons}>
          <Link to="/eth-lending" style={greenButton}>💸 Lend ETH</Link>
          <button style={blueButton} onClick={() => navigate('/borrow')}>📥 Borrow ETH</button>
          <button style={grayButton} onClick={() => navigate('/borrow-requests')}>📋 Check Borrow Requests</button>
          <button style={purpleButton} onClick={() => navigate('/lender-history')}>📊 View My Lending History</button>
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  position: 'relative',
  minHeight: '100vh',
  backgroundColor: '#000',
  color: '#fff',
  fontFamily: 'Inter, sans-serif',
  padding: '2rem',
  boxSizing: 'border-box'
};

const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  textAlign: 'center'
};

const disconnectButton = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  padding: '0.5rem 1rem',
  backgroundColor: '#444',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '0.9rem'
};

const connectButton = {
  padding: '0.5rem 1rem',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '1rem'
};

const navButtons = {
  position: 'absolute',
  bottom: '2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  justifyContent: 'center'
};

const greenButton = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#00c896',
  color: '#000',
  textDecoration: 'none',
  borderRadius: '5px',
  fontSize: '1rem',
  fontWeight: 'bold',
  boxShadow: '0 0 10px rgba(0, 200, 150, 0.5)'
};

const blueButton = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#3399ff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 0 10px rgba(51, 153, 255, 0.5)'
};

const grayButton = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#666',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
};

const purpleButton = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#9b59b6',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 0 10px rgba(155, 89, 182, 0.5)'
};

const successBanner = {
  backgroundColor: '#00c896',
  color: '#000',
  padding: '0.75rem 1.5rem',
  borderRadius: '5px',
  fontWeight: 'bold',
  marginTop: '1rem',
  boxShadow: '0 0 10px rgba(0, 200, 150, 0.5)'
};

export default Dashboard;
