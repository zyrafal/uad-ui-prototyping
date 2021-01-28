import React, { useEffect, useState } from "react";

import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Main } from "@aragon/ui";
import { UseWalletProvider } from "use-wallet";
import HomePage from "./components/HomePage";
import Trade from "./components/Trade/index";
import Wallet from "./components/Wallet";
import EpochDetail from "./components/EpochDetail";
import CouponMarket from "./components/CouponMarket";
import Governance from "./components/Governance";
import Regulation from "./components/Regulation";
import Pool from "./components/Pool";
import HomePageNoWeb3 from "./components/HomePageNoWeb3";
import ConnectButton from "./components/NavBar/ConnectButton";
import styles from "./app.module.scss";
import UseWindowSize from "./components/UseWindowSize";

function App() {
	const [hasWeb3, setHasWeb3] = useState(false);
	const [user, setUser] = useState(""); // the current connected user
	const [isMobile, setIsMobile] = useState(false);
	const windowSize = UseWindowSize();
	useEffect(() => {
		if (windowSize < 781) setIsMobile(true);
		else setIsMobile(false);
	}, [windowSize]);
	useEffect(() => {
		let isCancelled = false;

		async function updateUserInfo() {
			if (!isCancelled) {
				// @ts-ignore
				setHasWeb3(typeof window.ethereum !== "undefined");
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
	const [homeData, setHomeData] = useState(true);

	return (
		<Router>
			<UseWalletProvider
				chainId={1}
				connectors={{
					walletconnect: { rpcUrl: "https://mainnet.eth.aragon.network/" },
					walletlink: {
						url: "https://mainnet.eth.aragon.network/",
						appName: "Coinbase Wallet",
						appLogoUrl: "",
					},
				}}
			>
				<Main assetsUrl={`${process.env.PUBLIC_URL}/aragon-ui/`} layout={false}>
					{hasWeb3 ? (
						<Switch>
							<Route path="/dao/:override">
								<Wallet user={user} hasWeb3={hasWeb3} setUser={setUser} />
							</Route>
							<Route path="/dao/">
								<Wallet user={user} hasWeb3={hasWeb3} setUser={setUser} />
							</Route>
							<Route path="/epoch/">
								<EpochDetail user={user} hasWeb3={hasWeb3} setUser={setUser} />
							</Route>
							<Route path="/coupons/:override">
								<CouponMarket user={user} hasWeb3={hasWeb3} setUser={setUser} />
							</Route>
							<Route path="/coupons/">
								<CouponMarket user={user} hasWeb3={hasWeb3} setUser={setUser} />
							</Route>
							<Route path="/governance/">
								<Governance user={user} hasWeb3={hasWeb3} setUser={setUser} />
							</Route>
							<Route path="/trade/">
								<Trade user={user} hasWeb3={hasWeb3} setUser={setUser} />
							</Route>
							<Route path="/regulation/">
								<Regulation user={user} hasWeb3={hasWeb3} setUser={setUser} />
							</Route>
							<Route path="/pool/:override">
								<Pool user={user} hasWeb3={hasWeb3} setUser={setUser} />
							</Route>
							<Route path="/pool/">
								<Pool user={user} hasWeb3={hasWeb3} setUser={setUser} />
							</Route>
							<Route path="/">
								<div className={styles.dashboard}>
									<div className={styles.mainBoard}>
										<div className={styles.container}>
											<HomePage hasWeb3={hasWeb3} user={user} setUser={setUser} homeData={homeData} />
										</div>
									</div>

									<div
										className={styles.connectWallet}
										style={{
											position: user === "" && isMobile ? "absolute" : "relative",
										}}
									>
										<ConnectButton user={user} setUser={setUser} setter={setHomeData} />
									</div>
								</div>
							</Route>
						</Switch>
					) : (
						<Switch>
							<Route path="/">
								<HomePageNoWeb3 />
							</Route>
						</Switch>
					)}
				</Main>
			</UseWalletProvider>
		</Router>
	);
}

export default App;
