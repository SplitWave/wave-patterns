import axios, { AxiosResponse } from 'axios';

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

interface AllTokensBalanceResponse {
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
    const url = `https://api.shyft.to/sol/v1/wallet/stake_accounts?network=devnet&wallet_address=${walletAddress}&page=${page}&size=${size}`;
    const response: AxiosResponse<StakeAccountsResponse> = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching stake accounts:', error);
    throw error;
  }
};
