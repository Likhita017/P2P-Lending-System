import React from "react";
import styles from "./SurityCard.module.css";

export default function SurityCard({
  id,
  title,
  description,
  steps,
  risk,
  benefit,
  selected,
  onSelect
}) {
  return (
    <div
      className={`${styles.card} ${selected === id ? styles.active : ""}`}
      onClick={() => onSelect(id)}
    >
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={styles.meta}>
        <p><strong>✅ Benefit:</strong> {benefit}</p>
        <p><strong>⚠️ Risk:</strong> {risk}</p>
      </div>
      <details>
        <summary>Steps to Borrow</summary>
        <ul>
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
