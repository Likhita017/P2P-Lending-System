import React, { useState, useContext } from 'react';
import styles from './BorrowForm.module.css';
import { BorrowContext } from '../../context/BorrowContext';
import { WalletContext } from '../../context/WalletContext';
import { useNavigate } from 'react-router-dom';

const BorrowForm = () => {
  const { addBorrowRequest } = useContext(BorrowContext);
  const { walletAddress } = useContext(WalletContext);
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [borrowType, setBorrowType] = useState('');
  const [feedback, setFeedback] = useState('');
  const [friendAddress, setFriendAddress] = useState('');
  const [contacts, setContacts] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};

    if (!amount || !duration || !borrowType || !walletAddress) {
      newErrors.general = 'Please fill all fields and select a borrow type.';
    }

    if (borrowType === 'Frnd ETH' && (!friendAddress || !/^0x[a-fA-F0-9]{40}$/.test(friendAddress))) {
      newErrors.friendAddress = 'Invalid wallet address format.';
    }

    if (borrowType === 'Physical' && contacts.trim().split('\n').filter(Boolean).length < 2) {
      newErrors.contacts = 'Please enter at least 2 trusted contacts.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const request = {
      borrower: walletAddress,
      amount: parseFloat(amount),
      duration: parseInt(duration),
      borrowType,
      friendAddress: borrowType === 'Frnd ETH' ? friendAddress : '',
      contacts: borrowType === 'Physical' ? contacts : ''
    };

    addBorrowRequest(request);
    setFeedback('✅ Request submitted successfully!');
    setErrors({});

    setTimeout(() => setFeedback(''), 3000);

    setAmount('');
    setDuration('');
    setBorrowType('');
    setFriendAddress('');
    setContacts('');
  };

  return (
    <div className={styles.formContainer}>
      <h2>Borrow ETH</h2>

      <input
        type="number"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={styles.input}
      />

      <input
        type="number"
        placeholder="Duration (days)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className={styles.input}
      />

      {errors.general && <p className={styles.error}>{errors.general}</p>}

      <div
        className={`${styles.borrowTypeCard} ${borrowType === 'Own ETH' ? styles.selected : ''}`}
        onClick={() => setBorrowType('Own ETH')}
      >
        <h3>🔒 Use My Own ETH</h3>
        <p>Lock your own ETH as collateral. If you repay on time, your ETH is returned.</p>
        <ul>
          <li>✅ Fast approval, no third-party trust needed</li>
          <li>⚠️ You must have ETH upfront</li>
        </ul>
      </div>

      <div
        className={`${styles.borrowTypeCard} ${borrowType === 'Frnd ETH' ? styles.selected : ''}`}
        onClick={() => setBorrowType('Frnd ETH')}
      >
        <h3>🤝 Friend Will Provide ETH</h3>
        <p>Your friend locks ETH on your behalf. If you default, lender receives their ETH.</p>
        <input
          type="text"
          placeholder="Friend's wallet address"
          value={friendAddress}
          onChange={(e) => setFriendAddress(e.target.value)}
          className={styles.input}
        />
        {errors.friendAddress && <p className={styles.error}>{errors.friendAddress}</p>}
      </div>

      <div
        className={`${styles.borrowTypeCard} ${borrowType === 'Physical' ? styles.selected : ''}`}
        onClick={() => setBorrowType('Physical')}
      >
        <h3>📇 Share Trusted Contacts</h3>
        <p>Provide contacts who can vouch for you. Lenders may contact them before approval.</p>
        <textarea
          placeholder="Enter trusted contacts (email or phone)"
          value={contacts}
          onChange={(e) => setContacts(e.target.value)}
          className={styles.textarea}
        />
        {errors.contacts && <p className={styles.error}>{errors.contacts}</p>}
      </div>

      {feedback && <p className={styles.feedback}>{feedback}</p>}

      <div className={styles.buttonRow}>
        <button onClick={handleSubmit} className={styles.submitButton}>Submit Request</button>
        <button className={styles.cancelButton}>Cancel</button>
      </div>
    </div>
  );
};

export default BorrowForm;
