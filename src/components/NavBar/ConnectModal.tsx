import React, { useEffect } from "react";
import { useWallet } from "use-wallet";
import { IconClose } from "@aragon/ui";

import styles from "./index.module.scss";
type ConnectModalProps = {
  visible: boolean;
  onClose: Function;
  onConnect: Function;
};

function ConnectModal({ visible, onClose, onConnect }: ConnectModalProps) {
  const wallet = useWallet();

  const connectMetamask = () => {
    wallet.connect("injected");
  };

  const connectWalletConnect = () => {
    wallet.connect("walletconnect");
  };

  const connectCoinbase = () => {
    wallet.connect("walletlink");
  };

  useEffect(() => {
    if (wallet.account) {
      onConnect && onConnect(wallet);
      onClose && onClose();
    }
  }, [wallet, onConnect, onClose]);

  return (
    <>
      {visible && (
        <div className={styles.connectModal}>
          <div
            className={styles.mask}
            onClick={() => {
              onClose();
            }}
          ></div>
          <div className={styles.connectModalContainer}>
            <span
              style={{
                position: "fixed",
                top: "32px",
                right: "32px",
                zIndex: 20,
                color: "black",
              }}
              onClick={() => {
                onClose();
              }}
            >
              <IconClose size="medium" />
            </span>
            <div className={styles.header}>
              <p>Select a wallet provider</p>
            </div>
            <div className={styles.Item} onClick={connectMetamask}>
              <p>Metamask</p>
              <img src={`./wallets/metamask-fox.svg`} alt="Metamask" />
            </div>
            <div className={styles.Item} onClick={connectWalletConnect}>
              <p>WalletConnect</p>
              <img src={`./wallets/wallet-connect.svg`} alt="WalletConnect" />
            </div>
            <div className={styles.Item} onClick={connectCoinbase}>
              <p>Coinbase Wallet</p>
              <img
                src={`./wallets/coinbase-wallet.png`}
                alt="Coinbase Wallet"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ConnectModal;
