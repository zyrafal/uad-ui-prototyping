import Web3 from "web3";
import * as ethers from "ethers";

import BigNumber from "bignumber.js";
import { UniswapV2Router02 } from "../constants/contracts";
import { ESD, UNI, USDC } from "../constants/tokens";
import { POOL_EXIT_LOCKUP_EPOCHS } from "../constants/values";

const dollarAbi = require("../constants/abi/Dollar.json");
const daoAbi = require("../constants/abi/Implementation.json");
const poolAbi = require("../constants/abi/Pool.json");
const uniswapRouterAbi = require("../constants/abi/UniswapV2Router02.json");
const uniswapPairAbi = require("../constants/abi/UniswapV2Pair.json");

let provider;
// eslint-disable-next-line no-undef
if (window.ethereum !== undefined) {
  // eslint-disable-next-line no-undef
  provider = new ethers.providers.Web3Provider(window.ethereum);
}
export const getPrice0CumulativeLast = async () => {
  let signer = provider.getSigner();
  const price0 = new ethers.Contract(UNI.addr, uniswapPairAbi, signer).queryFilter();
  return price0.price0CumulativeLast();
};
/**
 *
 * @param {string} token address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getTokenBalance = async (token, account) => {
  if (account === "") return "0";
  let signer = provider.getSigner();
  const tokenContract = new ethers.Contract(token, dollarAbi, signer);
  return tokenContract.balanceOf(account);
};

export const getTokenTotalSupply = async (token) => {
  let signer = provider.getSigner();
  const tokenContract = new ethers.Contract(token, dollarAbi, signer);
  return tokenContract.totalSupply();
};

/**
 *
 * @param {string} token
 * @param {string} account
 * @param {string} spender
 * @return {Promise<string>}
 */
export const getTokenAllowance = async (token, account, spender) => {
  let signer = provider.getSigner();
  const tokenContract = new ethers.Contract(token, dollarAbi, signer);
  return tokenContract.allowance(account, spender);
};

// Døllar Protocol

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getBalanceBonded = async (dao, account) => {
  if (account === "") return "0";
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.balanceOfBonded(account);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getBalanceOfStaged = async (dao, account) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.balanceOfStaged(account);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getStatusOf = async (dao, account) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.statusOf(account);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getFluidUntil = async (dao, account) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.fluidUntil(account);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getLockedUntil = async (dao, account) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.lockedUntil(account);
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getEpoch = async (dao) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.epoch();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getEpochTime = async (dao) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.epochTime();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalDebt = async (dao) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.totalDebt();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalRedeemable = async (dao) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.totalRedeemable();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalCoupons = async (dao) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.totalCoupons();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalBonded = async (dao) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.totalBonded();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalStaged = async (dao) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.totalStaged();
};

/**
 *
 * @param {string} dao address
 * @param {number} epoch number
 * @return {Promise<string>}
 */
export const getTotalBondedAt = async (dao, epoch) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.totalBondedAt(epoch);
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getApproveFor = async (dao, candidate) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.approveFor(candidate);
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getRejectFor = async (dao, candidate) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.rejectFor(candidate);
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getStartFor = async (dao, candidate) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.startFor(candidate);
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getPeriodFor = async (dao, candidate) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.periodFor(candidate);
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<boolean>}
 */
export const getIsInitialized = async (dao, candidate) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.isInitialized(candidate);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getRecordedVote = async (dao, account, candidate) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.recordedVote(account, candidate);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {number} epoch number
 * @return {Promise<string>}
 */
export const getBalanceOfCoupons = async (dao, account, epoch) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.balanceOfCoupons(account, epoch);
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {number[]} epochs number[]
 * @return {Promise<string[]>}
 */
export const getBatchBalanceOfCoupons = async (dao, account, epochs) => {
  const calls = epochs.map((epoch) => getBalanceOfCoupons(dao, account, epoch));
  return Promise.all(calls);
};

/**
 *
 * @param {string} dao address
 * @param {number} epoch address
 * @return {Promise<string>}
 */
export const getOutstandingCoupons = async (dao, epoch) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.outstandingCoupons(epoch);
};

/**
 *
 * @param {string} dao address
 * @param {number} epoch number
 * @return {Promise<string>}
 */
export const getCouponsExpiration = async (dao, epoch) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.couponsExpiration(epoch);
};

/**
 *
 * @param {string} dao address
 * @param {number[]} epochs number[]
 * @return {Promise<string[]>}
 */
export const getBatchCouponsExpiration = async (dao, epochs) => {
  const calls = epochs.map((epoch) => getCouponsExpiration(dao, epoch));
  return Promise.all(calls);
};

/**
 *
 * @param {string} dao address
 * @param {string|BigNumber} amount uint256
 * @return {Promise<string>}
 */
export const getCouponPremium = async (dao, amount) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract
    .couponPremium(new BigNumber(amount).toFixed());
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getImplementation = async (dao) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.implementation();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getPool = async (dao) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  return daoContract.pool();
};

/**
 *
 * @param {string} dao
 * @param {string} account
 * @return {Promise<any[]>}
 */
export const getCouponEpochs = async (dao, account) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  const purchaseFilter = daoContract.filters.CouponPurchase({ account });
  const purchaseP = daoContract.queryFilter(purchaseFilter, 0);
  const transferFilter = daoContract.filters.CouponTransfer({ to: account });
  const transferP = daoContract.queryFilter(transferFilter, 0);

  const [bought, given] = await Promise.all([purchaseP, transferP]);
  const events = bought
    .map((e) => ({
      epoch: e.args.epoch,
      amount: e.args.couponAmount,
    }))
    .concat(given.map((e) => ({ epoch: e.args.epoch, amount: 0 })));

  const couponEpochs = [
    ...events
      .reduce((map, event) => {
        const { epoch, amount } = event;
        const prev = map.get(epoch);

        if (prev) {
          map.set(epoch, {
            epoch,
            coupons: prev.coupons.plus(new BigNumber(amount)),
          });
        } else {
          map.set(epoch, { epoch, coupons: new BigNumber(amount) });
        }

        return map;
      }, new Map())
      .values(),
  ];

  return couponEpochs.sort((a, b) => a - b);
};

/**
 *
 * @param {string} dao
 * @return {Promise<any[]>}
 */
export const getAllProposals = async (dao) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  const proposalFilter = daoContract.filters.Proposal();
  const payload = (
    await daoContract.queryFilter(proposalFilter, 0)
  ).map((event) => {
    const prop = event.args;
    prop.blockNumber = event.blockNumber;
    return prop;
  });
  return payload.sort((a, b) => b.blockNumber - a.blockNumber);
};

/**
 *
 * @param {string} dao
 * @return {Promise<any[]>}
 */
export const getAllRegulations = async (dao) => {
  let signer = provider.getSigner();
  const daoContract = new ethers.Contract(dao, daoAbi, signer);
  const increaseFilter = daoContract.filters.SupplyIncrease();
  const increaseP = daoContract.queryFilter(increaseFilter, 0);

  const decreaseFilter = daoContract.filters.SupplyDecrease();
  const decreaseP = daoContract.queryFilter(decreaseFilter, 0);

  const neutralFilter = daoContract.filters.SupplyNeutral();
  const neutralP = daoContract.queryFilter(neutralFilter, 0);

  const [increase, decrease, neutral] = await Promise.all([
    increaseP,
    decreaseP,
    neutralP,
  ]);

  const events = increase
    .map((e) => ({ type: "INCREASE", data: e.args }))
    .concat(decrease.map((e) => ({ type: "DECREASE", data: e.args })))
    .concat(neutral.map((e) => ({ type: "NEUTRAL", data: e.args })));

  return events.sort((a, b) => b.data.epoch - a.data.epoch);
};

// Uniswap Protocol

export const getCost = async (amount) => {
  let signer = provider.getSigner();
  const exchange = new ethers.Contract(UniswapV2Router02, uniswapRouterAbi, signer);
  // eslint-disable-next-line no-unused-vars
  const [inputAmount, _] = await exchange
    .getAmountsIn(new BigNumber(amount).toFixed(), [USDC.addr, ESD.addr]);
  return inputAmount;
};

export const getProceeds = async (amount) => {
  let signer = provider.getSigner();
  const exchange = new ethers.Contract(UniswapV2Router02, uniswapRouterAbi, signer);
  // eslint-disable-next-line no-unused-vars
  const [_, outputAmount] = await exchange
    .getAmountsOut(new BigNumber(amount).toFixed(), [ESD.addr, USDC.addr]);
  return outputAmount;
};

export const getReserves = async () => {
  let signer = provider.getSigner();
  const exchange = new ethers.Contract(UNI.addr, uniswapPairAbi, signer);
  return exchange.getReserves();
};

export const getInstantaneousPrice = async () => {
  const [reserve, token0] = await Promise.all([getReserves(), getToken0()]);
  const token0Balance = new BigNumber(reserve.reserve0);
  const token1Balance = new BigNumber(reserve.reserve1);
  if (token0.toLowerCase() === USDC.addr.toLowerCase()) {
    return token0Balance
      .multipliedBy(new BigNumber(10).pow(12))
      .dividedBy(token1Balance);
  }
  return token1Balance
    .multipliedBy(new BigNumber(10).pow(12))
    .dividedBy(token0Balance);
};

export const getToken0 = async () => {
  let signer = provider.getSigner();
  const exchange = new ethers.Contract(UNI.addr, uniswapPairAbi, signer);
  return exchange.token0();
};

// Pool

export const getPoolStatusOf = async (pool, account) => {
  let signer = provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);
  return poolContract.statusOf(account);
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfBonded = async (pool, account) => {
  if (account === "") return "0";
  let signer = provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);
  return poolContract.balanceOfBonded(account);
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfStaged = async (pool, account) => {
  let signer = provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);
  return poolContract.balanceOfStaged(account);
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfRewarded = async (pool, account) => {
  if (account === "") return "0";
  let signer = provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);
  return poolContract.balanceOfRewarded(account);
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfClaimable = async (pool, account) => {
  let signer = provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);
  return poolContract.balanceOfClaimable(account);
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalBonded = async (pool) => {
  let signer = provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);
  return poolContract.totalBonded();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalRewarded = async (pool) => {
  let signer = provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);
  return poolContract.totalRewarded();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalClaimable = async (pool) => {
  let signer = provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);
  return poolContract.totalClaimable();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolFluidUntil = async (pool, account) => {
  let signer = provider.getSigner();
  const poolContract = new ethers.Contract(pool, poolAbi, signer);

  // no need to look back further than the pool lockup period
  const blockNumber = await provider.getBlockNumber();
  const fromBlock = blockNumber - (POOL_EXIT_LOCKUP_EPOCHS + 1) * 8640;

  const bondFilter = poolContract.filters.Bond({ account: account });
  const bondP = poolContract.queryFilter(bondFilter, fromBlock);

  const unbondFilter = poolContract.filters.Bond({ account: account });
  const unbondP = poolContract.queryFilter(unbondFilter, fromBlock);

  const [bond, unbond] = await Promise.all([bondP, unbondP]);
  const events = bond
    .map((e) => e.args)
    .concat(unbond.map((e) => e.args));

  const startEpoch = events.reduce((epoch, event) => {
    if (epoch > event.start) return epoch;
    else return event.start;
  }, 0);

  // these contract events report the start epoch as one more than the active
  // epoch when the event is emitted, so we subtract 1 here to adjust
  return (parseInt(startEpoch, 10) + POOL_EXIT_LOCKUP_EPOCHS - 1).toString();
};
