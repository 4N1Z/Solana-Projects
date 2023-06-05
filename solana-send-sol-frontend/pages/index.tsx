import { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { AppBar } from "../components/AppBar";
import { SendSolForm } from "../components/SendSolForm";
import Head from "next/head";
import WalletContextProvider from "../components/WalletContextProvider";
// import {WalletContextProvider} from

const Home: NextPage = (props) => {
  return (
    <div className={styles.App}>
      <Head>
        <title>Wallet-Adapter Example</title>
        <meta name="description" content="Wallet-Adapter Example" />
      </Head>
      {/* <AppBar /> */}

      <WalletContextProvider>
        <AppBar />
        <div className={styles.AppBody}>
          {/* <BalanceDisplay /> */}
          <SendSolForm />
        </div>
      </WalletContextProvider>
    </div>
  );
};

export default Home;
