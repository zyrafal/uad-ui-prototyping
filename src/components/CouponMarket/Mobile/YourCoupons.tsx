import React, { useState } from "react";
import { IconArrowLeft } from "@aragon/ui";
import Card from "./Card";
import CardDetail from "./CardDetail";
import styles from "./index.module.scss";
type YourCouponsProps = {
  close: Function;
  epochs: any;
  redeemBtnAction: Function;
};

function YourCoupons({ close, epochs, redeemBtnAction }: YourCouponsProps) {
  const clickCard = (data) => {
    setCouponDetail(data);
    setShowModal(true);
  };
  const [showModal, setShowModal] = useState(false);
  const [couponDetail, setCouponDetail] = useState([]);
  return (
    <>
      {!showModal ? (
        <div className={styles.container}>
          <div className={styles.nav}>
            <span
              onClick={() => {
                close(false);
              }}
            >
              <IconArrowLeft size="large" />
            </span>
            <p>
              {epochs.length > 0 ? "Coupons" : "You don't have any coupons"}
            </p>
          </div>
          <div className={styles.content}>
            {epochs.map((epoch, index) => {
              return <Card key={index} epoch={epoch} click={clickCard} />;
            })}
          </div>
        </div>
      ) : (
        <CardDetail
          redeemBtnAction={redeemBtnAction}
          epoch={couponDetail}
          close={setShowModal}
        />
      )}
    </>
  );
}

export default YourCoupons;
