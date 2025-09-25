import React, { useState, useContext, useEffect } from 'react';
import { WalletContext } from '../../context/WalletContext';
import { BorrowContext } from '../../context/BorrowContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Number to words conversion utility function
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

const BorrowETH = ({ projectBalance, lendingOffers }) => {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [borrowType, setBorrowType] = useState('Own ETH');
  const [friendAddress, setFriendAddress] = useState('');
  const [contacts, setContacts] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [ethToInr, setEthToInr] = useState(0);
  const [inrValue, setInrValue] = useState(0);

  const { walletAddress } = useContext(WalletContext);
  const { addBorrowRequest } = useContext(BorrowContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEthToInrRate = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr'
        );
        setEthToInr(response.data.ethereum.inr);
      } catch (error) {
        console.error('Error fetching ETH to INR rate:', error);
      }
    };
    fetchEthToInrRate();
  }, []);

  useEffect(() => {
    if (amount && ethToInr) {
      setInrValue(parseFloat(amount) * ethToInr);
    } else {
      setInrValue(0);
    }
  }, [amount, ethToInr]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ethAmount = parseFloat(amount);
    const days = parseInt(duration);
    const newErrors = {};

    if (!walletAddress) {
      alert('Connect your wallet first');
      return;
    }

    if (ethAmount <= 0 || days <= 0) {
      alert('Invalid input');
      return;
    }

    if (borrowType === 'Friend ETH' && (!friendAddress || !/^0x[a-fA-F0-9]{40}$/.test(friendAddress))) {
      newErrors.friendAddress = '❌ Invalid wallet address format';
    }

    if (borrowType === 'Physical Collateral' && contacts.trim().split('\n').filter(Boolean).length < 2) {
      newErrors.contacts = '❌ Please provide at least 2 trusted contacts';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const request = {
      id: `req-${Date.now()}`,
      lender: 'Pending',
      borrower: walletAddress,
      amount: ethAmount,
      duration: days,
      interest: 'To be set by lender',
      fulfilled: false,
      borrowType,
      friendAddress: borrowType === 'Friend ETH' ? friendAddress : '',
      contacts: borrowType === 'Physical Collateral' ? contacts : '',
      timestamp: Date.now()
    };
    

    addBorrowRequest(request);
    setSuccessMessage(`✅ Request submitted: ${ethAmount} ETH for ${days} days using "${borrowType}"`);


    setAmount('');
    setDuration('');
    setFriendAddress('');
    setContacts('');
    setErrors({});
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '1rem' }}>📥 Borrow ETH</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="number"
            placeholder="Amount (ETH)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={inputStyle}
          />
          <div style={{ color: '#0f0', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ≈ ₹{inrValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            <span style={{ color: '#fff', fontWeight: 'normal', fontSize: '0.9rem' }}>
              ({numberToWords(Math.round(inrValue))} {Math.round(inrValue) === 1 ? 'rupee' : 'rupees'})
            </span>
          </div>
          <input
            type="number"
            placeholder="Duration (days)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            style={inputStyle}
          />
          <select value={borrowType} onChange={(e) => setBorrowType(e.target.value)} style={inputStyle}>
            <option>Own ETH</option>
            <option>Friend ETH</option>
            <option>Physical Collateral</option>
          </select>

          {borrowType === 'Own ETH' && (
            <div style={infoBlock}>
              <p><strong>Steps:</strong></p>
              <ul>
                <li>Enter amount and duration</li>
                <li>Smart contract locks your ETH</li>
                <li>Receive borrowed ETH</li>
                <li>Repay before deadline to unlock your ETH</li>
              </ul>
              <p>✅ Fast approval. ⚠ You must have ETH upfront.</p>
            </div>
          )}

          {borrowType === 'Friend ETH' && (
            <div style={infoBlock}>
              <p><strong>Steps:</strong></p>
              <ul>
                <li>Enter amount and duration</li>
                <li>Provide your friend’s wallet address</li>
                <li>Smart contract locks ETH from your friend</li>
                <li>Receive borrowed ETH</li>
                <li>Repay to release your friend’s ETH</li>
              </ul>
              <input
                type="text"
                placeholder="Friend's wallet address"
                value={friendAddress}
                onChange={(e) => setFriendAddress(e.target.value)}
                style={inputStyle}
              />
              {errors.friendAddress && <p style={errorStyle}>{errors.friendAddress}</p>}
              <p>✅ You can borrow without ETH. ⚠ Your friend must trust you.</p>
            </div>
          )}

          {borrowType === 'Physical Collateral' && (
            <div style={infoBlock}>
              <p><strong>Steps:</strong></p>
              <ul>
                <li>Enter amount and duration</li>
                <li>Provide 2–3 trusted contacts</li>
                <li>Lender reviews your request and contacts</li>
                <li>If approved, you receive ETH</li>
                <li>Repay to maintain reputation</li>
              </ul>
              <textarea
                placeholder="Enter trusted contacts (email or phone)"
                value={contacts}
                onChange={(e) => setContacts(e.target.value)}
                style={textareaStyle}
              />
              {errors.contacts && <p style={errorStyle}>{errors.contacts}</p>}
              <p>✅ No ETH needed upfront. ⚠ Approval depends on lender trust.</p>
            </div>
          )}

          <button type="submit" style={submitButton}>Submit Borrow Request</button>
        </form>
        {successMessage && <p style={successStyle}>{successMessage}</p>}
      </div>
      <button onClick={() => navigate('/')} style={backButton}>← Back to Dashboard</button>
    </div>
  );
};

const containerStyle = {
  backgroundColor: '#000',
  color: '#fff',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Inter, sans-serif',
  position: 'relative'
};

const cardStyle = {
  backgroundColor: '#1e1e1e',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 0 20px rgba(255,255,255,0.1)',
  width: '100%',
  maxWidth: '500px',
  textAlign: 'left'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#2a2a2a',
  color: '#fff',
  boxShadow: 'inset 0 0 5px rgba(255,255,255,0.1)'
};

const textareaStyle = {
  ...inputStyle,
  height: '80px',
  resize: 'vertical'
};

const submitButton = {
  padding: '0.75rem',
  backgroundColor: '#00c896',
  color: '#000',
  border: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 0 10px rgba(0, 200, 150, 0.5)'
};

const backButton = {
  position: 'absolute',
  bottom: '1rem',
  left: '2rem',
  backgroundColor: '#444',
  color: '#fff',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '5px',
  cursor: 'pointer'
};

const successStyle = {
  marginTop: '1rem',
  color: '#00ff99',
  fontWeight: 'bold'
};

const errorStyle = {
  color: '#ff4d4d',
  fontSize: '0.9rem',
  marginTop: '-0.5rem'
};

const infoBlock = {
  backgroundColor: '#111',
  padding: '1rem',
  borderRadius: '8px',
  marginTop: '1rem',
  fontSize: '0.95rem'
};

export default BorrowETH;