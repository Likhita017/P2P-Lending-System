import { useState, useContext } from "react";
import "./BorrowModal.css";
import BorrowSurityOptions from "../BorrowSurityOptions";
import { WalletContext } from "../../context/WalletContext";
import { BorrowContext } from "../../context/BorrowContext";

export default function BorrowModal({ onClose }) {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [surityType, setSurityType] = useState("self");
  const [friendAddress, setFriendAddress] = useState("");
  const [contacts, setContacts] = useState("");
  const [feedback, setFeedback] = useState("");
  const { walletAddress } = useContext(WalletContext);
  const { addBorrowRequest } = useContext(BorrowContext);

  const handleSubmit = () => {
    if (!walletAddress || !amount || !duration) {
      setFeedback("⚠️ Please fill in all required fields.");
      return;
    }

    const borrowRequest = {
      id: Date.now().toString(),
      borrower: walletAddress,
      amount: parseFloat(amount),
      duration: parseInt(duration),
      borrowType:
        surityType === "self" ? "Own ETH" :
        surityType === "friend" ? "Frnd ETH" :
        surityType === "contacts" ? "Physical" : "Unknown",
      friendAddress: surityType === "friend" ? friendAddress : undefined,
      contacts: surityType === "contacts" ? contacts : undefined,
      fulfilled: false
    };

    addBorrowRequest(borrowRequest);
    setFeedback("✅ Request submitted successfully!");

    setAmount("");
    setDuration("");
    setFriendAddress("");
    setContacts("");

    setTimeout(() => {
      setFeedback("");
      onClose();
    }, 3000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Borrow ETH</h2>

        <input
          type="number"
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="modal-input"
        />

        <input
          type="number"
          placeholder="Duration (days)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="modal-input"
        />

        <BorrowSurityOptions
          selected={surityType}
          onSelect={setSurityType}
        />

        {surityType === "friend" && (
          <input
            type="text"
            placeholder="Friend's wallet address"
            value={friendAddress}
            onChange={(e) => setFriendAddress(e.target.value)}
            className="modal-input"
          />
        )}

        {surityType === "contacts" && (
          <textarea
            placeholder="Trusted contacts (email or phone)"
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
            className="modal-textarea"
          />
        )}

        {feedback && <p className="modal-feedback">{feedback}</p>}

        <div className="modal-actions">
          <button onClick={handleSubmit} className="modal-submit">Submit</button>
          <button onClick={onClose} className="modal-cancel">Cancel</button>
        </div>

        <button onClick={onClose} className="modal-back">← Back to Dashboard</button>
      </div>
    </div>
  );
}
