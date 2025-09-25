import React from "react";
import SurityCard from "./SurityCard";
import styles from "./SurityOptions.module.css";

const modules = [
  {
    id: "self",
    title: "🔐 Use My Own ETH",
    description: "Lock your own ETH as collateral. If you repay on time, your ETH is returned. If you default, the lender receives it.",
    steps: [
      "Enter amount and duration",
      "Smart contract locks your ETH",
      "Receive borrowed ETH",
      "Repay before deadline to unlock your ETH"
    ],
    risk: "You must have ETH upfront",
    benefit: "Fast approval, no third-party trust needed"
  },
  {
    id: "friend",
    title: "🤝 Friend Will Provide ETH",
    description: "Your friend locks ETH on your behalf. If you repay, their ETH is returned. If you default, the lender receives your friend’s ETH.",
    steps: [
      "Enter amount and duration",
      "Provide your friend’s wallet address",
      "Smart contract locks ETH from your friend",
      "Receive borrowed ETH",
      "Repay to release your friend’s ETH"
    ],
    risk: "Your friend must trust you",
    benefit: "You can borrow even without ETH"
  },
  {
    id: "contacts",
    title: "📇 Share Trusted Contacts",
    description: "Provide names, emails, or phone numbers of people who can vouch for you. Lenders may contact them before approving your request.",
    steps: [
      "Enter amount and duration",
      "Provide 2–3 trusted contacts",
      "Lender reviews your request and contacts",
      "If approved, you receive ETH",
      "Repay to maintain reputation"
    ],
    risk: "Approval depends on lender’s trust",
    benefit: "No ETH needed upfront"
  }
];

export default function SurityOptions({
  surityType,
  setSurityType,
  friendAddress,
  setFriendAddress,
  contacts,
  setContacts
}) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {modules.map((mod) => (
          <SurityCard
            key={mod.id}
            id={mod.id}
            title={mod.title}
            description={mod.description}
            steps={mod.steps}
            risk={mod.risk}
            benefit={mod.benefit}
            selected={surityType}
            onSelect={setSurityType}
          />
        ))}
      </div>

      {surityType === "self" && (
        <div className={styles.module}>
          <p><strong>Instructions:</strong> Your ETH will be locked until repayment. Ensure you have enough ETH in your wallet.</p>
          <p className={styles.note}>✅ Fast approval. ⚠️ You must have ETH upfront.</p>
        </div>
      )}

      {surityType === "friend" && (
        <div className={styles.module}>
          <p><strong>Instructions:</strong> Enter your friend’s wallet address. They’ll be prompted to lock ETH on your behalf.</p>
          <input
            type="text"
            placeholder="Friend's wallet address"
            value={friendAddress}
            onChange={(e) => setFriendAddress(e.target.value)}
            className={styles.input}
          />
          {friendAddress && !/^0x[a-fA-F0-9]{40}$/.test(friendAddress) && (
            <p className={styles.error}>❌ Invalid wallet address format</p>
          )}
          <p className={styles.note}>✅ You can borrow without ETH. ⚠️ Your friend must trust you.</p>
        </div>
      )}

      {surityType === "contacts" && (
        <div className={styles.module}>
          <p><strong>Instructions:</strong> Provide 2–3 trusted contacts (email or phone). Lenders may reach out before approving.</p>
          <textarea
            placeholder="Enter trusted contacts (email or phone)"
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
            className={styles.textarea}
          />
          {contacts && contacts.split("\n").length < 2 && (
            <p className={styles.error}>❌ Please provide at least 2 contacts</p>
          )}
          <p className={styles.note}>✅ No ETH needed upfront. ⚠️ Approval depends on lender trust.</p>
        </div>
      )}
    </div>
  );
}
