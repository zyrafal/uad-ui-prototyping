import React, { useState, useEffect } from "react";
import Card from "./Card";
import styles from "./index.module.scss";
import UseWindowSize from "../../components/UseWindowSize";
import { IconClose } from "@aragon/ui";

type HowToUseProps = { setHowToUse: Function };

function HowToUse({ setHowToUse }: HowToUseProps) {
  const windowSize = UseWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (windowSize < 781) setIsMobile(true);
    else setIsMobile(false);
  }, [windowSize]);
  return (
    <>
      <span
        style={{
          position: "fixed",
          top: "32px",
          right: "32px",
          zIndex: 20,
          color: "black",
        }}
        onClick={() => {
          setHowToUse(false);
        }}
      >
        <IconClose size="medium" />
      </span>
      <div
        className={styles.mask}
        onClick={() => {
          if (!isMobile) setHowToUse(false);
        }}
      ></div>
      <div className={styles.container}>
        <div className={styles.howtouse}>
          <p>Inform yourself</p>
          <p>
            Universal Dollar (U8D) is an algorithmic decentralized stable coin
            based on the ERC-20 token built to be self-stabilizing. To start
            using U8D and get benefits of decentralised finance read and proceed
            with the following steps.
          </p>
          <Card
            number="1"
            title="Click on ‘Connect wallet’ (the yellow block) and choose your wallet"
            content="You need to have an Ethereum compatible wallet installed on your computer or an app on your mobile device to interact with this button"
            bgColor="#C3C3C3"
          />

          <Card
            number="2"
            title="Buy U8D tokens"
            content="Go to decentralized exchange, such as Uniswap, to acquire U8D tokens. To get the right links and the correct contract addresses, click the ‘Trade’ link in the menu"
            bgColor="#B5B5B5"
          />

          <Card
            number="3"
            title="Bond in DAO or LP  "
            content="Use U8D tokens to bond into DAO or to provide liquidity to the USDC-U8D pair on Uniswap"
            bgColor="#ABABAB"
          />
        </div>
        <style>{`span:hover{
          color: rgba(0,0,0,0.5) !important;
          cursor: pointer;
        }`}</style>
      </div>
    </>
  );
}

export default HowToUse;
