import BigNumber from 'bignumber.js';

// eslint-disable-next-line import/prefer-default-export
export const MAX_UINT256 = new BigNumber(2).pow(256).minus(1);
export const GOVERNANCE_QUORUM = new BigNumber('0.20');
export const GOVERNANCE_PROPOSAL_THRESHOLD = new BigNumber('0.01');
export const COUPON_EXPIRATION = 720

// unused
// export const DAO_EXIT_LOCKUP_EPOCHS = 15
// export const POOL_EXIT_LOCKUP_EPOCHS = 5

// may be need mainnet
// export const DAO_EXIT_STREAM_PERIOD = 259200 // in sec = 3 days
// export const POOL_LP_EXIT_STREAM_PERIOD = 129600 // in sec =  1.5 days
// export const POOL_REWARD_EXIT_STREAM_PERIOD = 129600 // in sec =  1.5 days

// may be need kovan
export const DAO_EXIT_LOCKUP_EPOCHS = 15;
export const POOL_EXIT_LOCKUP_EPOCHS = 5;
export const DAO_EXIT_STREAM_PERIOD = 259200 // in sec = 3 days
export const POOL_LP_EXIT_STREAM_PERIOD = 129600 // in sec =  1.5 days
export const POOL_REWARD_EXIT_STREAM_PERIOD = 129600 // in sec = 1.5 days
