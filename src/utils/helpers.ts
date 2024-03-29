import axios, { AxiosResponse } from 'axios';
import { request } from 'graphql-request';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

interface TokenInfo {
  name: string;
  symbol: string;
  image: string;
}

interface TokenBalance {
  address: string;
  balance: number;
  associated_account: string;
  info: TokenInfo;
}

export interface AllTokensBalanceResponse {
  success: boolean;
  message: string;
  result: TokenBalance[];
}

interface Token {
  address: string;
  balance: number;
  associated_account: string;
}

interface NFT {
  model: string;
  address: string;
  mintAddress: string;
  updateAuthorityAddress: string;
  json: any;
  jsonLoaded: boolean;
  name: string;
  symbol: string;
  uri: string;
  isMutable: boolean;
  primarySaleHappened: boolean;
  sellerFeeBasisPoints: number;
  editionNonce: number;
  creators: {
    address: string;
    verified: boolean;
    share: number;
  }[];
  tokenStandard: any;
  collection: any;
  collectionDetails: any;
  uses: any;
}

interface PortfolioResponse {
  success: boolean;
  message: string;
  result: {
    sol_balance: number;
    num_tokens: number;
    tokens: Token[];
    num_nfts: number;
    nfts: NFT[];
  };
}

interface StakeAccount {
  stake_account_address: string;
  stake_authority_address: string;
  withdraw_authority_address: string;
  vote_account_address: string;
  status: string;
  total_amount: number;
  rent: number;
  delegated_amount: number;
  active_amount: number;
  activation_epoch: number;
  deactivation_epoch: number | null;
  state: string;
}

interface StakeAccountsResponse {
  success: boolean;
  message: string;
  result: {
    data: StakeAccount[];
    page: number;
    size: number;
    total_data: number;
    total_page: number;
  };
}

export interface KaminoPoints {
  leaderboardRank: number;
  totalPointsEarned: number;
  avgBoost: number;
}

export interface TokenPrice {
  value: number;
  updateUnixTime: number;
}

interface HistoricalTokenPrice {
  unixTime: number;
  value: number;
}

export const getKaminoPoints = async (
  walletAddress: string
): Promise<KaminoPoints> => {
  try {
    const url = `https://api.hubbleprotocol.io/points/users/${walletAddress}/breakdown?env=mainnet-beta`;
    const response: AxiosResponse<KaminoPoints> = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching kamino points:', error);
    throw error;
  }
};

export const fetchAllTokensBalance = async (
  walletAddress: string
): Promise<AllTokensBalanceResponse[]> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found in environment variables.');
    }
    const url = `https://api.shyft.to/sol/v1/wallet/all_tokens?network=mainnet-beta&wallet=${walletAddress}`;
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };

    const response: AxiosResponse<AllTokensBalanceResponse[]> = await axios.get(
      url,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching tokens balance:', error);
    throw error;
  }
};

export const getParsedTransactionHistory = async (walletAddress: string) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found in environment variables.');
    }
    const url = `https://api.shyft.to/sol/v1/wallet/parsed_transaction_history?network=mainnet-beta&account=${walletAddress}&tx_num=10`;
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };

    const response: AxiosResponse<AllTokensBalanceResponse[]> = await axios.get(
      url,
      { headers }
    );
    console.log('transaction history', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching tokens balance:', error);
    throw error;
  }
};

export const getTokenPrice = async (
  tokenAddress: string
): Promise<TokenPrice[]> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found in environment variables.');
    }
    const url = `https://public-api.birdeye.so/public/price?address=${tokenAddress}`;
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'x-chain': 'solana',
    };

    const response: AxiosResponse<TokenPrice[]> = await axios.get(url, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching token price:', error);
    throw error;
  }
};

export const getMultipleTokenPrice = async (
  tokenAddresses: string[]
): Promise<TokenPrice[]> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found in environment variables.');
    }

    // Construct the URL with the list of token addresses
    const url = `https://public-api.birdeye.so/public/multi_price?list_address=${tokenAddresses.join(
      '%2C'
    )}`;

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'x-chain': 'solana',
    };

    const response: AxiosResponse<TokenPrice[]> = await axios.get(url, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching multiple token prices:', error);
    throw error;
  }
};

export const getHistoricalTokenPrice = async (
  tokenAddress: string,
  time_from: number, //unixtime
  time_to: number //unixtime
): Promise<HistoricalTokenPrice[]> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found in environment variables.');
    }
    const url = `https://public-api.birdeye.so/public/history_price?address=${tokenAddress}&address_type=token&time_from=${time_from}&time_to=${time_to}`;
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'x-chain': 'solana',
    };

    const response: AxiosResponse<HistoricalTokenPrice[]> = await axios.get(
      url,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching historical token price:', error);
    throw error;
  }
};

const URL = clusterApiUrl('mainnet-beta');

export async function getDateTokenWasRecievedInWallet(tokenAddress: string) {
  try {
    const connection = new Connection(
      'https://docs-demo.solana-mainnet.quiknode.pro/'
    );
    //const connection = new Connection(URL);
    const publicKey = new PublicKey(tokenAddress);
    let txList = await connection.getSignaturesForAddress(publicKey, {
      limit: 1000,
    });

    const txs = txList.map((tx) => tx.signature);
    const parsedTxs = await connection.getParsedTransactions(txs, {
      maxSupportedTransactionVersion: 0,
    });
    console.log('parsed transaction info', parsedTxs);
    let length = txList.length - 1;
    let blocktime = txList[length].blockTime;

    if (blocktime) {
      const date = new Date(blocktime * 1000);
      return date;
    }
  } catch (error) {
    console.error('Error fetching signatures:', error);
  }
}

export const getPortfolio = async (
  walletAddress: string
): Promise<PortfolioResponse> => {
  try {
    const url = `https://api.shyft.to/sol/v1/wallet/get_portfolio?network=mainnet-beta&wallet=${walletAddress}`;
    const response: AxiosResponse<PortfolioResponse> = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

export const getStakeAccounts = async (
  walletAddress: string,
  page: number,
  size: number
): Promise<StakeAccountsResponse> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found in environment variables.');
    }
    const url = `https://api.shyft.to/sol/v1/wallet/stake_accounts?network=mainnet-beta&wallet_address=${walletAddress}&page=${page}&size=${size}`;

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };

    const response: AxiosResponse<StakeAccountsResponse> = await axios.get(
      url,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching stake accounts:', error);
    throw error;
  }
};

export const getFarmsUserState = async (publicKey: string) => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  if (!apiKey) {
    throw new Error('API key not found in environment variables.');
  }
  const endpoint = `https://programs.shyft.to/v0/graphql/?api_key=${apiKey}`;
  const query = `
  query MyQuery {
    farms_UserState(
      where: {owner: {_eq: "${publicKey}"}}
    ) {
      _lamports
      activeStakeScaled
      bump
      delegatee
      farmState
      lastStakeTs
      legacyStake
      owner
      pendingDepositStakeScaled
      pendingDepositStakeTs
      pendingWithdrawalUnstakeScaled
      pendingWithdrawalUnstakeTs
      userId
      FarmState {
        _lamports
        delegateAuthority
        depositCapAmount
        depositWarmupPeriod
        farmAdmin
        farmVault
        farmVaultsAuthority
        farmVaultsAuthorityBump
        globalConfig
        lockingDuration
        lockingEarlyWithdrawalPenaltyBps
        lockingMode
        lockingStartTimestamp
        numRewardTokens
        numUsers
        pendingFarmAdmin
        scopeOracleMaxAge
        scopeOraclePriceId
        scopePrices
        slashedAmountCumulative
        slashedAmountCurrent
        slashedAmountSpillAddress
        strategyId
        timeUnit
        token
        totalActiveStakeScaled
        totalPendingAmount
        totalPendingStakeScaled
        totalStakedAmount
        withdrawAuthority
        withdrawalCooldownPeriod
      }
    }
  }
    `;

  try {
    const data: any = await request(endpoint, query);

    return data.farms_UserState;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Error fetching data');
  }
};

export const getLendingObligation = async (publicKey: string) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found in environment variables.');
    }

    const endpoint = `https://programs.shyft.to/v0/graphql/?api_key=${apiKey}`;
    const query = `
    query MyQuery {
      kamino_lending_Obligation(
        where: {owner: {_eq: "${publicKey}"}}
      ) {
        lendingMarket
        owner
        borrows
        borrowedAssetsMarketValueSf
        borrowFactorAdjustedDebtValueSf
        allowedBorrowValueSf
        deposits
        lowestReserveDepositLtv
        depositedValueSf
        pubkey

      }
    }
    `;

    const data: any = await request(endpoint, query);
    return data.kamino_lending_Obligation;
  } catch (error) {
    console.error('Error fetching lending obligation:', error);
    throw error;
  }
};
