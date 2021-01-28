import React from "react";
import styles from "./index.module.scss";
function HomePageNoWeb3() {
  return (
    <>
      <div className={styles.mask}></div>
      <div className={styles.content}>
        <div className={styles.warning}>No web3 wallet detected</div>
        <a
          href="https://www.metamask.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.btn}>
            <p>Click to get Metamask</p>
            <img src={`./wallets/metamask-fox.svg`} alt="Metamask" />
          </div>
        </a>
      </div>
    </>
  );
}

export default HomePageNoWeb3;
