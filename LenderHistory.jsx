import React, { useEffect, useState } from 'react';
import styles from './LenderHistory.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function numberToWords(num) {
  if (num === 0) return 'zero';
  var a = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
  ];
  var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  var arr = [];
  var n = Math.floor(num);
  var str = n.toString();
  while (str.length < 9) str = '0' + str;
  var crore = parseInt(str.substr(0,2));
  var lakh = parseInt(str.substr(2,2));
  var thousand = parseInt(str.substr(4,2));
  var hundred = parseInt(str.substr(6,1));
  var ten = parseInt(str.substr(7,2));
  if (crore) arr.push(convertNN(crore) + ' crore');
  if (lakh) arr.push(convertNN(lakh) + ' lakh');
  if (thousand) arr.push(convertNN(thousand) + ' thousand');
  if (hundred) arr.push(a[hundred] + ' hundred');
  if (ten) arr.push(convertNN(ten));
  return arr.join(' ').trim();
  function convertNN(n) {
    if (n < 20) return a[n];
    var ones = n % 10;
    var tens = Math.floor(n / 10);
    return b[tens] + (ones ? ' ' + a[ones] : '');
  }
}


const LenderHistory = ({ lendingOffers }) => {
  const navigate = useNavigate();
  const [ethToInr, setEthToInr] = useState(0);

  useEffect(() => {
    const fetchEthToInrRate = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr'
        );
        setEthToInr(response.data.ethereum.inr);
      } catch (error) {
        setEthToInr(0);
      }
    };
    fetchEthToInrRate();
  }, []);

  return (
    <div className={styles.container} style={{ position: 'relative', minHeight: '100vh' }}>
      <h2 className={styles.header}>📜 Lender History</h2>
      {(!lendingOffers || lendingOffers.length === 0) ? (
        <p className={styles.empty}>No fulfilled requests yet.</p>
      ) : (
        <ul className={styles.verticalList}>
          {lendingOffers.map((offer, index) => {
            const now = Date.now();
            const elapsedDays = Math.floor((now - offer.timestamp) / (1000 * 60 * 60 * 24));
            const daysLeft = Math.max(offer.duration - elapsedDays, 0);
            const interestEth = ((parseFloat(offer.amount) * parseFloat(offer.interest)) / 100).toFixed(4);
            const amountInr = ethToInr ? parseFloat(offer.amount) * ethToInr : 0;
            const interestInr = ethToInr ? parseFloat(interestEth) * ethToInr : 0;

            return (
              <li key={index} className={styles.card}>
                <p>
                  <strong>Amount:</strong> {offer.amount} ETH
                  {ethToInr > 0 &&
                    <span style={{ color: '#0f0', marginLeft: '0.7em', fontWeight: 'bold', fontSize: '0.95em' }}>
                      (₹{amountInr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}, {numberToWords(Math.round(amountInr))} {Math.round(amountInr) === 1 ? 'rupee' : 'rupees'})
                    </span>
                  }
                </p>
                <p><strong>Borrower:</strong> {offer.borrower}</p>
                <p><strong>Duration:</strong> {offer.duration} days</p>
                <p><strong>Interest Rate:</strong> {offer.interest}%</p>
                <p><strong>Days Left:</strong> {daysLeft} days</p>
                <p>
                  <strong>Interest Earned:</strong> {interestEth} ETH
                  {ethToInr > 0 &&
                    <span style={{ color: '#0f0', marginLeft: '0.7em', fontWeight: 'bold', fontSize: '0.95em' }}>
                      (₹{interestInr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}, {numberToWords(Math.round(interestInr))} {Math.round(interestInr) === 1 ? 'rupee' : 'rupees'})
                    </span>
                  }
                </p>
                <p><strong>Lender:</strong> {offer.lender}</p>
              </li>
            );
          })}
        </ul>
      )}
      <button
        className={styles.backButton}
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '2rem',
          zIndex: 1001
        }}
        onClick={() => navigate('/')}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default LenderHistory;