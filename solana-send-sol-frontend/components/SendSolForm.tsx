import { FC, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as Web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export const SendSolForm: FC = () => {
  const [sentTrans, setSentTrans] = useState(" ");
  const [Balance, setBalance] = useState(0);
  const transaction = new Web3.Transaction();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();


  const link = () => {
    return sentTrans
      ? `https://explorer.solana.com/tx/${sentTrans}?cluster=devnet`
      : "";
  };

  const sendSol = (event) => {
    const revcieverKey = new Web3.PublicKey(event.target.recipient.value);

    if (!connection || !publicKey) {
      alert("Enter public key or connect to a network ");
      return;
    } else {
      alert("Are you sure ?");
    }
    
    const sendSolInstruction = Web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: revcieverKey,
      lamports: LAMPORTS_PER_SOL * event.target.amount.value,
    });

    // event.preventDefault();

    transaction.add(sendSolInstruction);
    sendTransaction(transaction, connection).then((sig) => {
      setSentTrans(sig);
    });
    console.log(
      `Send ${event.target.amount.value} SOL to ${event.target.recipient.value}`
    );
  };


  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }
  
    connection.getAccountInfo(publicKey)
      .then((info) => {
        setBalance(info.lamports);
      })
      .catch((error) => {
        // Handle the error appropriately (e.g., show an error message)
        console.error('Error retrieving account info:', error);
      });
  }, [connection, publicKey]);

  return (
    <div>
        <h3  className={styles.heading}>Send SOL from your account to any account</h3>
      {publicKey ? (
        <form onSubmit={sendSol} className={styles.form}>
          <label htmlFor="amount">Amount (in SOL) to send:</label>
          <input
            id="amount"
            type="text"
            className={styles.formField}
            placeholder="e.g. 0.1"
            required
          />
          <br />
          <label htmlFor="recipient">Send SOL to:</label>
          <input
            id="recipient"
            type="text"
            className={styles.formField}
            placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA"
            required
          />
          <button type="submit" className={styles.formButton}>
            Send
          </button>
        </form>
      ) : (
        <span>Connect Your Wallet</span>
      )}
      {sentTrans ? (
        <div className={styles.viewTransaction}>
          <p>View your transaction on </p>
          <a href={link()}>Solana Explorer</a>
        </div>
      ) : null}
      <div className="balance">
        <p>{publicKey ? `Balance : ${Balance / LAMPORTS_PER_SOL}` : ""}</p>
      </div>
    </div>
  );
};
