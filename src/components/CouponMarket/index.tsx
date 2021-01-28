import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
  getCouponPremium,
  getTokenAllowance,
  getTokenBalance,
  getTokenTotalSupply,
  getTotalCoupons,
  getTotalDebt,
  getTotalRedeemable,
} from "../../utils/infura";
import { CSSTransition } from "react-transition-group";
import { ESD, ESDS } from "../../constants/tokens";
import { toTokenUnitsBN } from "../../utils/number";
import BigNumber from "bignumber.js";
import PurchaseCoupons from "./PurchaseCoupons";
import PurchaseCouponsMobile from "./Mobile/PurchaseCouponsMobile";
import PurchaseHistory from "./PurchaseHistory";
import PurchaseHistoryMobile from "./Mobile/PurchaseHistoryMobile";
import ModalWarning from "./ModalWarning";
import { approve } from "../../utils/web3";
import { MAX_UINT256 } from "../../constants/values";
import NavBar from "../../components/NavBar";
import UseWindowSize from "../../components/UseWindowSize";
import { BigNumberPlainText } from "../common/index";
import { ownership } from "../../utils/number";
import styles from "./index.module.scss";
import "../NavBar/fade.css";

const ONE_COUPON = new BigNumber(10).pow(18);

function CouponMarket({
  user,
  hasWeb3,
  setUser,
}: {
  user: string;
  hasWeb3: boolean;
  setUser: Function;
}) {
  const history = useHistory();
  if (user === "") {
    history.push("/");
  }
  const { override } = useParams();
  if (override) {
    user = override;
  }

  // const storedHideRedeemed = getPreference("hideRedeemedCoupons", "0");

  const [balance, setBalance] = useState(new BigNumber(0));
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const [supply, setSupply] = useState(new BigNumber(0));
  const [coupons, setCoupons] = useState(new BigNumber(0));
  const [redeemable, setRedeemable] = useState(new BigNumber(0));
  const [couponPremium, setCouponPremium] = useState(new BigNumber(0));
  const [debt, setDebt] = useState(new BigNumber(0));
  // const [hideRedeemed, setHideRedeemed] = useState(storedHideRedeemed === "1");
  const [unlockBtn, SetUnlockBtn] = useState(false);
  const windowSize = UseWindowSize();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (windowSize < 781) setIsMobile(true);
    else setIsMobile(false);
  }, [windowSize]);
  useEffect(() => {
    if (user === "") {
      setBalance(new BigNumber(0));
      setAllowance(new BigNumber(0));
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [balanceStr, allowanceStr] = await Promise.all([
        getTokenBalance(ESD.addr, user),
        getTokenAllowance(ESD.addr, user, ESDS.addr),
      ]);

      const userBalance = toTokenUnitsBN(balanceStr, ESD.decimals);

      if (!isCancelled) {
        setBalance(new BigNumber(userBalance));
        setAllowance(new BigNumber(allowanceStr));
        new BigNumber(allowanceStr);
      }

      if (new BigNumber(allowanceStr).comparedTo(MAX_UINT256) === 0)
        SetUnlockBtn(true);
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        supplyStr,
        debtStr,
        couponsStr,
        redeemableStr,
      ] = await Promise.all([
        getTokenTotalSupply(ESD.addr),
        getTotalDebt(ESDS.addr),
        getTotalCoupons(ESDS.addr),
        getTotalRedeemable(ESDS.addr),
      ]);

      const totalSupply = toTokenUnitsBN(supplyStr, ESD.decimals);
      const totalDebt = toTokenUnitsBN(debtStr, ESD.decimals);
      const totalCoupons = toTokenUnitsBN(couponsStr, ESD.decimals);
      const totalRedeemable = toTokenUnitsBN(redeemableStr, ESD.decimals);

      if (!isCancelled) {
        setSupply(new BigNumber(totalSupply));
        setDebt(new BigNumber(totalDebt));
        setCoupons(new BigNumber(totalCoupons));
        setRedeemable(new BigNumber(totalRedeemable));

        if (totalDebt.isGreaterThan(new BigNumber(1))) {
          const couponPremiumStr = await getCouponPremium(
            ESDS.addr,
            ONE_COUPON
          );
          setCouponPremium(toTokenUnitsBN(couponPremiumStr, ESD.decimals));
        } else {
          setCouponPremium(new BigNumber(0));
        }
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  const handleUnlockBtn = async () => {
    if (user === "") {
      alert("connect metamask first");
      return;
    }
    await approve(ESD.addr, ESDS.addr);
    SetUnlockBtn(true);
  };

  return (
    <>
      <NavBar user={user} hasWeb3={hasWeb3} setUser={setUser}>
        <span>
          <div>
            <div className={styles.firstLine}>
              Total Debt
              <div>
                <BigNumberPlainText asset="" balance={debt} suffix={" U8D"} />
              </div>
            </div>
            <div className={styles.firstLine}>
              Coupons
              <div>
                <BigNumberPlainText
                  asset=""
                  balance={coupons}
                  suffix={" U8D"}
                />
              </div>
            </div>
            <div className={styles.firstLine}>
              Debt Ratio
              <div>
                <BigNumberPlainText
                  asset=""
                  balance={ownership(debt, supply)}
                  suffix={" %"}
                />
              </div>
            </div>
            <div className={styles.firstLine}>
              Premium
              <div>
                <BigNumberPlainText
                  asset=""
                  balance={couponPremium.multipliedBy(100)}
                  suffix={" %"}
                />
              </div>
            </div>
          </div>
          <p></p>
        </span>
      </NavBar>
      <CSSTransition in={true} timeout={200} classNames="fade" unmountOnExit>
        <div>
          <ModalWarning />
        </div>
      </CSSTransition>

      {!unlockBtn && (
        <div
          className={styles.unlockStageMask}
          onClick={() => {
            handleUnlockBtn();
          }}
        >
          <div className={styles.title}>Coupons</div>
          <div className={styles.unlockBtn}>+ Unlock Coupons</div>
        </div>
      )}
      {unlockBtn && (
        <div className={styles.container}>
          {!isMobile && (
            <>
              <PurchaseCoupons
                user={user}
                allowance={allowance}
                balance={balance}
                debt={debt}
              />
              <PurchaseHistory
                user={user}
                hideRedeemed={false}
                totalRedeemable={redeemable}
              />
            </>
          )}
          {isMobile && (
            <>
              <PurchaseCouponsMobile
                user={user}
                allowance={allowance}
                balance={balance}
                debt={debt}
              />
              <PurchaseHistoryMobile user={user} totalRedeemable={redeemable} />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default CouponMarket;
