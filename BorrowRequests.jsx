import React, { useContext, useEffect, useMemo } from 'react';
import styles from './BorrowRequests.module.css';
import { WalletContext } from '../../context/WalletContext';
import { BorrowContext } from '../../context/BorrowContext';
import { useNavigate } from 'react-router-dom';

const BorrowRequests = () => {
  const { walletAddress } = useContext(WalletContext);
  const { requests, fulfillRequest } = useContext(BorrowContext);
  const navigate = useNavigate();

  const activeRequests = useMemo(() => {
    return Array.isArray(requests)
      ? requests.filter(r => r && !r.fulfilled)
      : [];
  }, [requests]);

  const handleFulfill = (requestId) => {
    if (!walletAddress || !requestId) return;
    fulfillRequest(requestId, walletAddress);
  };

  const handleLend = (borrowerAddress, amount, duration, requestId) => {
    navigate(`/eth-lending?borrower=${borrowerAddress}&amount=${amount}&duration=${duration}&requestId=${requestId}`);
  };

  useEffect(() => {
    console.log('Rendering BorrowRequests');
    console.log('Wallet:', walletAddress);
    console.log('Active Requests:', activeRequests);
  }, [walletAddress, activeRequests]);

  return (
    <div className={styles.container}>
      <h2>📋 Active Borrow Requests</h2>
      {activeRequests.length === 0 ? (
        <p className={styles.empty}>No active requests.</p>
      ) : (
        <ul className={styles.list}>
          {activeRequests.map((req) => (
            <li key={req.id} className={styles.card}>
              <div className={styles.details}>
                <p><strong>Borrower:</strong> {req.borrower}</p>
                <p><strong>Amount:</strong> {req.amount} ETH</p>
                <p><strong>Duration:</strong> {req.duration} days</p>
                <p><strong>Type:</strong>
                  {req.borrowType === 'Own ETH' && '🟢 Own ETH'}
                  {req.borrowType === 'Friend ETH' && '🔵 Friend ETH'}
                  {req.borrowType === 'Physical Collateral' && '🟠 Physical Collateral'}
                </p>
                {req.friendAddress && <p><strong>Friend:</strong> {req.friendAddress}</p>}
                {req.contacts && <p><strong>Contacts:</strong><br />{req.contacts}</p>}
              </div>

              <div className={styles.actions}>
                {walletAddress &&
                  walletAddress.toLowerCase() !== req.borrower?.toLowerCase() && (
                    <button className={styles.fulfillButton} onClick={() => handleFulfill(req.id)}>
                      ✅ Fulfill Request
                    </button>
                )}
                <button
                  className={styles.lendButton}
                  onClick={() => handleLend(req.borrower, req.amount, req.duration, req.id)}
                >
                  💸 Lend ETH
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/')} className={styles.backButton}>
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default BorrowRequests;
