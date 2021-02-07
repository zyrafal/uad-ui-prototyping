/* eslint-disable camelcase */
import * as ethers from "ethers";
import BigNumber from "bignumber.js";

import { notify } from "./txNotifier.ts";
import { UniswapV2Router02 } from "../constants/contracts";

import { ESD, USDC } from "../constants/tokens";

const uniswapRouterAbi = require("../constants/abi/UniswapV2Router02.json");
const testnetUSDCAbi = require("../constants/abi/TestnetUSDC.json");
const daoAbi = require("../constants/abi/Implementation.json");
const poolAbi = require("../constants/abi/Pool.json");

const DEADLINE_FROM_NOW = 60 * 15;
const UINT256_MAX =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

/**
 * Connection Utilities
 */
export const updateModalMode = async (theme) => {
  window.darkMode = theme === "dark";
};

export const connect = async (ethereum) => {
  window.provider = new ethers.providers.Web3Provider(ethereum);
  let accounts = await window.provider.listAccounts();
  if (!accounts.length) {
    try {
      await window.ethereum.enable();
      accounts = await window.provider.listAccounts();
    } catch (e) {
      return null;
    }
  }
  return accounts.length ? accounts[0].toLowerCase() : null;
};

// eslint-disable-next-line consistent-return
export const checkConnectedAndGetAddress = async () => {
  let accounts = await window.provider.listAccounts();
  if (!accounts.length) {
    try {
      await window.ethereum.enable();
      accounts = await window.provider.listAccounts();
    } catch (e) {
      return null;
    }
  }
  return accounts.length ? accounts[0] : null;
};

/**
 * ERC20 Utilities
 */

export const approve = async (tokenAddr, spender, amt = UINT256_MAX) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const oToken = new ethers.Contract(tokenAddr, testnetUSDCAbi, signer);
  try {
    const tx = await oToken.approve(spender, amt, { from: account })
    const hash = await tx.wait()
    notify.hash(tx.hash);
  } catch (error) {

  }
};

export const mintTestnetUSDC = async (amount) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const usdc = new ethers.Contract(USDC.addr, testnetUSDCAbi, signer);

  try {
    const tx = await usdc
      .mint(account, new BigNumber(amount).toFixed(), { from: account });
    const hash = await tx.wait()
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

/**
 * Uniswap Protocol
 */

export const buyESD = async (buyAmount, maxInputAmount) => {
  const account = await checkConnectedAndGetAddress();
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW;

  let signer = window.provider.getSigner();
  const router = new ethers.Contract(UniswapV2Router02, uniswapRouterAbi, signer);

  try {
    const tx = await router
      .swapTokensForExactTokens(
        buyAmount,
        maxInputAmount,
        [USDC.addr, ESD.addr],
        account,
        deadline,
        { from: account }
      );
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const sellESD = async (sellAmount, minOutputAmount) => {
  const account = await checkConnectedAndGetAddress();
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW;

  let signer = window.provider.getSigner();
  const router = new ethers.Contract(UniswapV2Router02, uniswapRouterAbi, signer);

  try {
    const tx = await router
      .swapExactTokensForTokens(
        sellAmount,
        minOutputAmount,
        [ESD.addr, USDC.addr],
        account,
        deadline,
        { from: account }
      );
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const addLiquidity = async (amountESD, amountUSDC, slippage) => {
  const account = await checkConnectedAndGetAddress();
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW;
  const slippageBN = new BigNumber(slippage);
  const minAmountESD = new BigNumber(amountESD)
    .multipliedBy(new BigNumber(1).minus(slippageBN))
    .integerValue(BigNumber.ROUND_FLOOR);
  const minAmountUSDC = new BigNumber(amountUSDC)
    .multipliedBy(new BigNumber(1).minus(slippageBN))
    .integerValue(BigNumber.ROUND_FLOOR);

  let signer = window.provider.getSigner();
  const router = new ethers.Contract(UniswapV2Router02, uniswapRouterAbi, signer);

  try {
    const tx = await router
      .addLiquidity(
        ESD.addr,
        USDC.addr,
        new BigNumber(amountESD).toFixed(),
        new BigNumber(amountUSDC).toFixed(),
        minAmountESD,
        minAmountUSDC,
        account,
        deadline,
        { from: account }
      );
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const removeLiquidity = async (
  liquidityAmount,
  minAmountESD,
  minAmountUSDC
) => {
  const account = await checkConnectedAndGetAddress();
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW;

  let signer = window.provider.getSigner();
  const router = new ethers.Contract(UniswapV2Router02, uniswapRouterAbi, signer);

  try {
    const tx = await router
      .removeLiquidity(
        ESD.addr,
        USDC.addr,
        new BigNumber(liquidityAmount).toFixed(),
        new BigNumber(minAmountESD).toFixed(),
        new BigNumber(minAmountUSDC).toFixed(),
        account,
        deadline,
        { from: account }
      );
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

/**
 * Døllar Protocol
 */

export const advance = async (dao) => {
  const account = await checkConnectedAndGetAddress();

  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .advance({
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const deposit = async (dao, amount) => {
  const account = await checkConnectedAndGetAddress();
  
  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .deposit(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const depositAndBond = async (dao, amount) => {
  const account = await checkConnectedAndGetAddress();

  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .depositAndBond(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const withdraw = async (dao, amount) => {
  const account = await checkConnectedAndGetAddress();

  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .withdraw(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const startStream = async (dao, amount) => {
  const account = await checkConnectedAndGetAddress();

  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .startStream(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const boostStream = async (dao) => {
  const account = await checkConnectedAndGetAddress();

  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .boostStream({
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const startLpStream = async (pooladdress, amount) => {
  const account = await checkConnectedAndGetAddress();

  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pooladdress, poolAbi, signer);

  try {
    const tx = await poolContract
      .startLpStream(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const boostLpStream = async (pooladdress) => {
  const account = await checkConnectedAndGetAddress();

  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pooladdress, poolAbi, signer);

  try {
    const tx = await poolContract
      .boostLpStream({
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const startRewardStream = async (pooladdress, amount) => {
  const account = await checkConnectedAndGetAddress();

  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pooladdress, poolAbi, signer);

  try {
    const tx = await poolContract
      .startRewardStream(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const boostRewardStream = async (pooladdress) => {
  const account = await checkConnectedAndGetAddress();

  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pooladdress, poolAbi, signer);

  try {
    const tx = await poolContract
      .boostRewardStream({
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const release = async (dao) => {
  const account = await checkConnectedAndGetAddress();

  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .release({
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const cancelStream = async (dao) => {
  const account = await checkConnectedAndGetAddress();

  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .cancelStream({
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const releasableAmount = async (dao) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return await daoContract.releasableAmount(account)
};

export const streamTimeleft = async (dao) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return await daoContract.streamTimeleft(account);
};

export const unreleasedAmount = async (dao) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return await daoContract.unreleasedAmount(account);
};

export const releaseLp = async (pool) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);

  try {
    const tx = await poolContract
      .releaseLp({
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const cancelLpStream = async (pool) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);

  try {
    const tx = await poolContract
      .cancelLpStream({
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const releasableLpAmount = async (pool) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);
  return await poolContract.releasableLpAmount(account);
};

export const streamLpTimeleft = async (pool) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);
  return await poolContract.streamLpTimeleft(account);
};

export const unreleasedLpAmount = async (pool) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);
  return await poolContract.unreleasedLpAmount(account);
};

export const releaseReward = async (pool) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);

  try {
    const tx = await poolContract
      .releaseReward({
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const cancelRewardStream = async (pool) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);

  try {
    const tx = await poolContract
      .cancelRewardStream({
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const releasableRewardAmount = async (pool) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);
  return await poolContract.releasableRewardAmount(account);
};

export const streamRewardTimeleft = async (pool) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);
  return await poolContract.streamRewardTimeleft(account);
};

export const unreleasedRewardAmount = async (pool) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);
  return await poolContract.unreleasedRewardAmount(account);
};

export const bond = async (dao, amount) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .bond(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const unbond = async (dao, amount) => {
  const account = await checkConnectedAndGetAddress();

  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .unbond(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const unbondUnderlying = async (dao, amount) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .unbondUnderlying(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const purchaseCoupons = async (dao, amount) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .purchaseCoupons(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const redeemCoupons = async (dao, epoch, amount) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .redeemCoupons(epoch, new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const recordVote = async (dao, candidate, voteType) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .vote(candidate, voteType, {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

export const commit = async (dao, candidate) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);

  try {
    const tx = await daoContract
      .commit(candidate, {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
  } catch (error) {
    
  }
};

/* UNI-V2 Incentivization Pool */
export const depositPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);

  try {
    const tx = await poolContract
      .deposit(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
    callback(tx.hash);
  } catch (error) {
    
  }
};

export const withdrawPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);

  try {
    const tx = await poolContract
      .withdraw(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
    callback(tx.hash);
  } catch (error) {
    
  }
};

export const bondPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);

  try {
    const tx = await poolContract
      .bond(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
    callback(tx.hash);
  } catch (error) {
    
  }
};

export const unbondPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);

  try {
    const tx = await poolContract
      .unbond(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
    callback(tx.hash);
  } catch (error) {
    
  }
};

export const claimPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);

  try {
    const tx = await poolContract
      .claim(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
    callback(tx.hash);
  } catch (error) {
    
  }
};

export const providePool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  let signer = window.provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);

  try {
    const tx = await poolContract
      .provide(new BigNumber(amount).toFixed(), {
        from: account,
      });
    await tx.wait();
    notify.hash(tx.hash);
    callback(tx.hash);
  } catch (error) {
    
  }
};
