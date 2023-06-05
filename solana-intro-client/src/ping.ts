import * as Web3 from "@solana/web3.js";
import * as fs from "fs";
import dotenv from "dotenv";
import { SystemProgram, Keypair } from "@solana/web3.js";

const PROGRAM_ID = new Web3.PublicKey(
  "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"
);
const PROGRAM_DATA_PUBLIC_KEY = new Web3.PublicKey(
  "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"
);

async function intializeKeypair(
  connection: Web3.Connection
): Promise<Web3.Keypair> {
  if (!process.env.PRIVATE_KEY) {
    console.log("Generating new keypair ...");
    const signer = Web3.Keypair.generate();

    const balance = await connection.getBalance(signer.publicKey);
    console.log("Current balance is", balance / Web3.LAMPORTS_PER_SOL, "SOL");

    console.log("Creating .env file");
    fs.writeFileSync(".env", `PRIVATE_KEY = [${signer.secretKey.toString()}]`);

    return signer;
  }

  // This goes inside the .env file and takes the key
  // As the key is in string it converts it to bas58
  // From the key it selecrs the secret key
  const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecret = Web3.Keypair.fromSecretKey(secretKey);

  return keypairFromSecret;
}

async function pingProgram(
  connection: Web3.Connection,
  amount: number,
  receiver: Web3.PublicKey,
  payer: Web3.Keypair
) {
  const transaction = new Web3.Transaction();
  const transactionSignature = await Web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  );

  const transferInstruction = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: receiver,
    lamports: amount,
  });

  transaction.add(transferInstruction);
  const sig = await Web3.sendAndConfirmTransaction(connection, transaction, [
    payer,
  ]);
  console.log(
    `You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${sig}?cluster=devnet`
  );

  // console.log(
  //   `Transaction https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  //   )
}

async function airdropSolIfNeeded(
  signer: Web3.Keypair,
  connection: Web3.Connection
) {
  const balance = await connection.getBalance(signer.publicKey);
  console.log("Current balance is", balance / Web3.LAMPORTS_PER_SOL, "SOL");

  // 1 SOL should be enough for almost anything you wanna do
  if (balance / Web3.LAMPORTS_PER_SOL < 1) {
    // You can only get up to 2 SOL per request
    console.log("Airdropping 1 SOL");
    const airdropSignature = await connection.requestAirdrop(
      signer.publicKey,
      Web3.LAMPORTS_PER_SOL
    );

    const latestBlockhash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature: airdropSignature,
    });

    const newBalance = await connection.getBalance(signer.publicKey);
    console.log("New balance is", newBalance / Web3.LAMPORTS_PER_SOL, "SOL");
  }
}

async function main() {
  console.log("Ready to transfer SOL ..");

  const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"));
  const payerKey = await intializeKeypair(connection);
//   await connection.requestAirdrop(
//     payerKey.publicKey,
//     Web3.LAMPORTS_PER_SOL * 1
//   );
  await airdropSolIfNeeded(payerKey,connection)
  const lamports = 0.1 * Web3.LAMPORTS_PER_SOL;
  pingProgram(
    connection,
    lamports,
    Web3.Keypair.generate().publicKey,
    payerKey
  );
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
