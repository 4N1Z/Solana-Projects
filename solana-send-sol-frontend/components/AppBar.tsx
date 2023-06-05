import { FC } from 'react'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const AppBar: FC = () => {
    return (
        <div className={styles.AppHeader}>
            <Image src="/solanaLogo.png" height={15} width={100} />
            <span>Send SOL</span>
            {/* <button>Connect</button> */}
            <WalletMultiButton/>
        </div>
    )
}