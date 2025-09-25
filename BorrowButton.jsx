import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BorrowButton.module.css'; // Scoped CSS Module

const BorrowButton = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/borrow');
  };

  return (
    <button className={styles.borrowBtn} onClick={handleRedirect}>
      Borrow ETH
    </button>
  );
};

export default BorrowButton;
