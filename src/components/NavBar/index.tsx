import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { useWallet } from "use-wallet";
import ConnectButton from "./ConnectButton";
import Logo from "../Logo";
import UseWindowSize from "../../components/UseWindowSize";
import { LinkBase } from "@aragon/ui";
import styles from "./index.module.scss";
import HowToUse from "../HowToUse";
import Contacts from "../Contacts";
import "./fade.css";
type NavbarProps = {
  hasWeb3: boolean;
  user: string;
  setUser: Function;
  children: React.ReactNode;
};

function NavBar({ hasWeb3, user, setUser, children }: NavbarProps) {
  const history = useHistory();

  const [show, setShow] = useState(false);
  const windowSize = UseWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  const [howToUse, setHowToUse] = useState(false);
  const [contacts, setContacts] = useState(false);
  const [page, setPage] = useState("");
  const [menuStatus, setMenuStatus] = useState("close");
  const { status, reset } = useWallet();

  const disconnectWeb3 = async () => {
    setUser("");
    reset();
  };
  useEffect(() => {
    return history.listen((location) => {
      setPage(location.pathname);
    });
  }, [hasWeb3, user, history]);
  const menuClicked = (location: string) => {
    history.push(location);
    setShow(false);
    setMenuStatus("close");
  };
  useEffect(() => {
    if (windowSize < 781) setIsMobile(true);
    else setIsMobile(false);
  }, [windowSize]);

  return (
    <>
      {/* {howToUse && <HowToUse setHowToUse={setHowToUse} />} */}
      {/* {contacts && <Contacts setContacts={setContacts} />} */}
      {!isMobile && (
        <CSSTransition in={show} timeout={200} classNames="fade" unmountOnExit>
          <div>
            <div className={styles.mask} onClick={() => setShow(false)}></div>
            <div className={styles.connectWalletContainer}>
              <div className={styles.connectWallet}>
                <ConnectButton user={user} setUser={setUser} />
              </div>
            </div>
          </div>
        </CSSTransition>
      )}
      <CSSTransition
        in={howToUse}
        timeout={200}
        classNames="fade"
        unmountOnExit
      >
        <div>
          <HowToUse setHowToUse={setHowToUse} />
        </div>
      </CSSTransition>

      <CSSTransition
        in={contacts}
        timeout={200}
        classNames="fade"
        unmountOnExit
      >
        <div>
          <Contacts setContacts={setContacts} />
        </div>
      </CSSTransition>

      <div className={styles.otherPagesNav}>
        <Logo user={user} />
        {children}

        {!isMobile && (
          <div
            className={styles.BurgerMenu_container}
            onClick={() => setShow(true)}
          >
            <i></i>
            <i></i>
            <i></i>
          </div>
        )}
        {isMobile && (
          <>
            <div
              className="BurgerMenu_container"
              role="button"
              onClick={() => {
                setMenuStatus(menuStatus === "open" ? "close" : "open");
              }}
            >
              <i className={menuStatus}></i>
              <i className={menuStatus}></i>
              <i className={menuStatus}></i>
            </div>
            <div
              className={menuStatus === "open" ? "nav-menu active" : "nav-menu"}
            >
              {status === "connected" && (
                <img
                  alt=""
                  src="images/icons8-disconnected.svg"
                  onClick={disconnectWeb3}
                  style={{ position: "fixed", top: "31px", right: "66px" }}
                />
              )}
              <LinkButton
                title="/ Home"
                onClick={() => menuClicked("/")}
                isSelected={page.includes("/")}
              />
              <LinkButton
                title="/ DAO"
                onClick={() => menuClicked("/dao/")}
                isSelected={page.includes("/dao")}
              />
              <LinkButton
                title="/ LP"
                onClick={() => menuClicked("/pool/")}
                isSelected={page.includes("/pool")}
              />
              <LinkButton
                title="/ Coupons"
                onClick={() => menuClicked("/coupons/")}
                isSelected={page.includes("/coupons")}
              />
              <LinkButton
                title="/ Trade"
                onClick={() => menuClicked("/trade/")}
                isSelected={page.includes("/trade")}
              />
              <LinkButton
                title="/ Regulation"
                onClick={() => menuClicked("/regulation/")}
                isSelected={page.includes("/regulation")}
              />
              <LinkButton
                title="/ Governance"
                onClick={() => menuClicked("/governance/")}
                isSelected={page.includes("/governance")}
              />
              <LinkButton
                title="/ How to use"
                onClick={() => setHowToUse(true)}
              />
              <LinkButton title="/ Social" onClick={() => setContacts(true)} />
            </div>
          </>
        )}
      </div>
      <style>{`
        nav {
            width: 100%;
          }
          .NavBarmain {
            padding-left: 32px;
            background: #060606;
            width: 100%;
            margin: auto;
            min-height: 0vh;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            color: white;
          }

          .nav-menu {
            display: flex;
            list-style: none;
            text-align: center;
          }
          .nav-menu button div{
            font-size: 16px !important;
          }
          .nav-menu img{
            display: none;
          }
          .nav-menu button:nth-child(1) {
            display: none;
          }
          .nav-menu button:nth-child(2) {
            display: none;
          }
          .nav-menu button:nth-child(3) {
            display: none;
          }
          .nav-menu button:nth-child(4) {
            display: none;
          }
          .nav-menu button div:hover{
            color: rgba(255,255,255,0.7);
          }
          .BurgerMenu_container {
            display: none;
            margin-top: 4px;
            cursor: pointer;
          }

          @media (max-width: 780px) {
            .NavBarmain {
              padding-left: 32px;
              justify-content: space-between;
            }
            .NavBar-s {
              width: 100%;
              padding: 0px;
            }
            .nav-menu {
              display: flex;
              background: #060606;
              flex-direction: column;
              height: 300%;
              position: absolute;
              top: 55px;
              left: -100%;
              opacity: 1;
              padding: 0px;
            }
            .nav-menu.active {
              display: flex;
              position: fixed;
              width: 100%;
              top: 60px;
              left: 0;
              opacity: 1;
              z-index: 10;
              flex-direction: column;
              justify-content: flex-end;
              height: calc( 100% - 56px);
            }
            .nav-menu.active img{
              display: block;
            }
            .nav-menu.active img:hover{
              cursor: pointer;
              opacity: 0.7;
            }
            .nav-menu.active button {
              padding-left: 24px;
              text-align: left;
              display: block;
              margin-top: 24px;
            }
            .nav-menu.active button div{
              font-size: 32px !important;
              line-height: 48px;
              padding: 0;
              color: white;
            }
            .BurgerMenu_container {
              display: flex;
              flex-direction: column;
              position: absolute;
              right: 32px;
              top: 32px;
            }
            i {
              background-color: #fff;
              width: 20px;
              height: 2px;
              margin: 1.5px;
              transition: all ease 0.5s;
            }
            .open:nth-child(1) {
              transform: rotate(45deg) translateY(7.3px);
            }
            .open:nth-child(2) {
              opacity: 0;
            }
            .open:nth-child(3) {
              transform: rotate(-45deg) translateY(-7.3px);
            }
            .close:nth-child(1) {
              transform: rotate(0) translateY(0);
            }
            .close:nth-child(2) {
              opacity: 1;
            }
            .close:nth-child(3) {
              transform: rotate(0) translateY(0);
            }
          }
        `}</style>
    </>
  );
}
type linkButtonProps = {
  title: string;
  onClick: Function;
  isSelected?: boolean;
};

function LinkButton({ title, onClick, isSelected = false }: linkButtonProps) {
  return (
    <LinkBase
      onClick={onClick}
      style={{ marginLeft: "8px", marginRight: "8px", height: "48px" }}
    >
      <div style={{ opacity: 1, fontSize: 17 }}>{title}</div>
    </LinkBase>
  );
}
export default NavBar;
