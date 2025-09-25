import React, { useState, useContext, useEffect } from 'react';
import { WalletContext } from '../../context/WalletContext';
import { BorrowContext } from '../../context/BorrowContext';
import { useNavigate, useLocation } from 'react-router-dom';
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

const ETHLending = ({ onSubmitOffer }) => {
  const { walletAddress, balance, setBalance } = useContext(WalletContext);
  const { fulfillRequest } = useContext(BorrowContext);
  const [borrower, setBorrower] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [interest, setInterest] = useState('');
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState(null);

  const [ethToInr, setEthToInr] = useState(0);
  const [inrValue, setInrValue] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const prefillBorrower = queryParams.get('borrower');
    const prefillAmount = queryParams.get('amount');
    const prefillDuration = queryParams.get('duration');
    const prefillRequestId = queryParams.get('requestId');

    if (prefillBorrower && /^0x[a-fA-F0-9]{40}$/.test(prefillBorrower)) setBorrower(prefillBorrower);
    if (prefillAmount && !isNaN(prefillAmount)) setAmount(prefillAmount);
    if (prefillDuration && !isNaN(prefillDuration)) setDuration(prefillDuration);
    if (prefillRequestId) setRequestId(prefillRequestId);
  }, [location.search]);

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

    if (!/^0x[a-fA-F0-9]{40}$/.test(borrower)) {
      alert('Invalid Ethereum address');
      return;
    }

    const offer = {
      lender: walletAddress,
      borrower,
      amount,
      duration,
      interest,
      timestamp: Date.now()
    };

    onSubmitOffer(offer);

    setBalance((prev) => parseFloat(prev) - parseFloat(amount));
    setSuccess(true);

    if (requestId) {
      fulfillRequest(requestId, walletAddress);
    }

    setBorrower('');
    setAmount('');
    setDuration('');
    setInterest('');
  };

  const isDisabled = !walletAddress || parseFloat(balance) <= 0;

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate('/')} style={backButton}>← Back to Dashboard</button>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ marginBottom: '1rem', color: '#fff' }}>💸 Lend ETH</h2>
        <input type="text" placeholder="Borrower Address (0x...)" value={borrower} onChange={(e) => setBorrower(e.target.value)} required style={inputStyle} />
        <input type="number" placeholder="Amount (ETH)" value={amount} onChange={(e) => setAmount(e.target.value)} required style={inputStyle} />
        <div style={{ color: '#0f0', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ≈ ₹{inrValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })} 
          <span style={{ color: '#fff', fontWeight: 'normal', fontSize: '0.9rem' }}>
            ({numberToWords(Math.round(inrValue))} {Math.round(inrValue) === 1 ? 'rupee' : 'rupees'})
          </span>
        </div>
        <input type="number" placeholder="Duration (days)" value={duration} onChange={(e) => setDuration(e.target.value)} required style={inputStyle} />
        <input type="number" placeholder="Interest Rate (%)" value={interest} onChange={(e) => setInterest(e.target.value)} required style={inputStyle} />
        <button type="submit" style={{ ...submitButton, backgroundColor: isDisabled ? '#555' : '#00c896', cursor: isDisabled ? 'not-allowed' : 'pointer' }} disabled={isDisabled}>✅ Submit</button>
        {isDisabled && <p style={{ color: 'orange', fontSize: '0.9rem', marginTop: '0.5rem' }}>⚠ You need ETH in your wallet to lend.</p>}
        {success && <p style={{ color: 'lightgreen', marginTop: '1rem' }}>Lending offer submitted!</p>}
      </form>
    </div>
  );
};

const containerStyle = { backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', position: 'relative'};
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#111', padding: '2rem', borderRadius: '10px', boxShadow: '0 0 20px rgba(255,255,255,0.05)', width: '100%', maxWidth: '400px'};
const inputStyle = { padding: '0.75rem', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#222', color: '#fff', fontSize: '1rem'};
const submitButton = { padding: '0.75rem', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold'};
const backButton = { position: 'absolute', bottom: '1rem', left: '2rem', padding: '0.5rem 1rem', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem'};

export default ETHLending;