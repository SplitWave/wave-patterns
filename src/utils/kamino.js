import { Connection, PublicKey } from '@solana/web3.js';
import { KaminoMarket } from '@hubbleprotocol/kamino-lending-sdk';
import Decimal from 'decimal.js';

const SHYFT_API_KEY = process.env.NEXT_PUBLIC_API_KEY; //enter your SHYFT API key

export async function getObligationSDK(ownerAddress) {
  const connection = new Connection(
    'https://docs-demo.solana-mainnet.quiknode.pro/'
  );

  const mainMarketLoader = KaminoMarket.load(
    connection,
    new PublicKey('7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF')
  ); // main market address. Defaults to 'Main' market

  const jlpMarketLoader = KaminoMarket.load(
    connection,
    new PublicKey('DxXdAyU3kCjnyggvHmY5nAwg5cRbbmdyX3npfDMjjMek')
  ); // jlp market address

  const altCoinsMarketLoader = KaminoMarket.load(
    connection,
    new PublicKey('ByYiZxp8QrdN9qbdtaAiePN8AAr3qvTPppNJDpf5DVJ5')
  ); // altcoins market address

  const allMarkets = await Promise.all([
    mainMarketLoader,
    jlpMarketLoader,
    altCoinsMarketLoader,
  ]);

  const mainMarket = allMarkets[0];
  const jlpMarket = allMarkets[1];
  const altCoinsMarket = allMarkets[2];

  const mainMarketObligations = getObligationsFromMarket(
    mainMarket,
    ownerAddress
  );
  const jlpMarketObligations = getObligationsFromMarket(
    jlpMarket,
    ownerAddress
  );
  const altCoinsMarketObligations = getObligationsFromMarket(
    altCoinsMarket,
    ownerAddress
  );

  const arrayedObligations = await Promise.all([
    mainMarketObligations,
    jlpMarketObligations,
    altCoinsMarketObligations,
  ]);
  //getting all obligations from all markets for a wallet

  const combinedObligations = [];

  for (const obligation of arrayedObligations) {
    if (obligation.success) {
      combinedObligations.push(...obligation.obligations);
    }
  }

  const allReservesRequired = new Set();

  for (const obligation of combinedObligations) {
    if (obligation.deposits) {
      obligation.deposits.forEach((deposit) => {
        if (
          deposit.depositReserve &&
          deposit.depositReserve.toBase58() !==
            '11111111111111111111111111111111'
        ) {
          allReservesRequired.add(deposit.depositReserve.toBase58());
        }
      });
    }
    if (obligation.borrows) {
      obligation.borrows.forEach((borrow) => {
        if (
          borrow.borrowReserve &&
          borrow.borrowReserve.toBase58() !== '11111111111111111111111111111111'
        ) {
          allReservesRequired.add(borrow.borrowReserve.toBase58());
        }
      });
    }
  }

  const reservePromises = [];

  for (const reserve of allReservesRequired) {
    reservePromises.push(
      getReservesFromMarket(reserve, mainMarket, jlpMarket, altCoinsMarket)
    );
  }

  const allTokenDetails = await Promise.all(reservePromises);
  //getting all reserves related to the Obligations fetched, from 3 markets

  const reservesMap = new Map();

  for (const tokenDetails of allTokenDetails) {
    if (tokenDetails) {
      reservesMap.set(tokenDetails.reserveAddress, tokenDetails);
    }
  }
  //This is a map, which stores the reserves address and token details in a key:value format

  const depositedAssets = [];
  const borrowedAssets = [];

  for (const obligation of combinedObligations) {
    //each user may have multiple obligations
    if (obligation.deposits && Array.isArray(obligation.deposits)) {
      //each obligation may have multiple deposits, in such cases we display the ones which have a valid depositReserve
      obligation.deposits?.forEach((deposit) => {
        if (
          deposit.depositReserve &&
          deposit.depositReserve.toBase58() !==
            '11111111111111111111111111111111'
        ) {
          const depositedAsset = reservesMap.get(
            deposit.depositReserve.toBase58()
          );

          if (
            depositedAsset.success &&
            deposit.depositedAmount &&
            depositedAsset.tokenDecimals
          ) {
            depositedAssets.push({
              amount:
                Number(deposit.depositedAmount.toString()) /
                10 ** Number(depositedAsset.tokenDecimals.toString()),
              tokenAddress: depositedAsset.tokenAddress,
            });
          }
        }
      });
    }
    if (obligation.borrows) {
      //each obligation may have multiple borrows, in such cases we display the ones which have a valid borrowReserve
      obligation.borrows.forEach((borrow) => {
        if (
          borrow.borrowReserve &&
          borrow.borrowReserve.toBase58() !== '11111111111111111111111111111111'
        ) {
          const borrowedAsset = reservesMap.get(
            borrow.borrowReserve.toBase58()
          );
          const borrowedValue = new Decimal(borrow.borrowedAmountSf.toString())
            .div(2 ** 60)
            .div(10 ** Number(borrowedAsset.tokenDecimals?.toString()))
            .toDecimalPlaces(2);
          if (borrowedAsset.success)
            borrowedAssets.push({
              amount: borrowedValue,
              tokenAddress: borrowedAsset.tokenAddress,
            });
        }
      });
    }
  }
  return { depositedAssets, borrowedAssets };
}

async function getObligationsFromMarket(market, walletAddress) {
  //this function gets all obligations for a user from a market
  const obligationsAll = {
    success: false,
    obligations: [],
  };
  try {
    const obligationDetails = await market?.getAllUserObligations(
      new PublicKey(walletAddress)
    );
    if (!obligationDetails || !obligationDetails.length) {
      console.error(
        'Could not find obligations for wallet in market: ',
        marketAddress
      );
      return obligationsAll;
    }

    for (const obligation in obligationDetails) {
      obligationsAll.obligations.push(obligationDetails[obligation].state);
    }

    obligationsAll.success = true;
  } catch (error) {
    console.log(error);
    return obligationsAll;
  }
  return obligationsAll;
}

async function getReservesFromMarket(
  reserveAddress,
  mainMarket,
  jlpMarket = null,
  altCoinsMarket = null
) {
  //this function gets token address and decimals from a reserve
  const reserveResponse = {
    success: false,
    reserveAddress: reserveAddress,
    tokenAddress: '',
    tokenDecimals: 1,
  };
  try {
    const reserveDetails = await mainMarket?.getReserveByAddress(
      new PublicKey(reserveAddress)
    );

    reserveResponse.tokenAddress =
      reserveDetails.state.liquidity.mintPubkey.toBase58();
    reserveResponse.tokenDecimals = reserveDetails.state.liquidity.mintDecimals;
    reserveResponse.success = true;
    return reserveResponse;
  } catch (error) {
    // console.error("Could not find reserve in main market, checking other markets...");
  }

  try {
    if (!reserveResponse.success && jlpMarket !== null) {
      const reserveDetails = await jlpMarket?.getReserveByAddress(
        new PublicKey(reserveAddress)
      );

      reserveResponse.tokenAddress =
        reserveDetails.state.liquidity.mintPubkey.toBase58();
      reserveResponse.tokenDecimals =
        reserveDetails.state.liquidity.mintDecimals;
      reserveResponse.success = true;
      return reserveResponse;
    }
  } catch (error) {
    // console.error("Could not find reserve in jpl market, checking other markets...");
  }

  try {
    if (!reserveResponse.success && altCoinsMarket !== null) {
      const reserveDetails = await altCoinsMarket?.getReserveByAddress(
        new PublicKey(reserveAddress)
      );

      reserveResponse.tokenAddress =
        reserveDetails.state.liquidity.mintPubkey.toBase58();
      reserveResponse.tokenDecimals =
        reserveDetails.state.liquidity.mintDecimals;
      reserveResponse.success = true;
      return reserveResponse;
    }
  } catch (error) {
    console.error('Could not find reserve: ', reserveAddress);
  }
  return reserveResponse;
}

async function getObligationDataByGraphQl(ownerAddress) {
  //get obligation data for a particular user wallet using graphQl
  const operationsDoc = `
        query MyQuery {
          kamino_lending_Obligation(
            where: {owner: {_eq: ${JSON.stringify(ownerAddress)}}}
          ) {
            tag
            borrowedAssetsMarketValueSf
            borrows
            depositedValueSf
            deposits
            lendingMarket
            owner
            pubkey
          }
        }
      `; //graphQl query
  const result = await fetch(
    `https://programs.shyft.to/v0/graphql/accounts?api_key=${SHYFT_API_KEY}&network=mainnet-beta`, //SHYFT's GQL endpoint
    {
      method: 'POST',
      body: JSON.stringify({
        query: operationsDoc,
        variables: {},
        operationName: 'MyQuery',
      }),
    }
  );

  return await result.json();
}

async function getReserveDataByGraphQl(reservePubkeys) {
  //get liquidity reserve details, retrives token address
  const operationsDoc = `
        query MyQuery {
          kamino_lending_Reserve(
            where: {pubkey: {_in: ${JSON.stringify(reservePubkeys)}}}
          ) {
            liquidity
            pubkey
          }
        }
      `; //graphQl query to get token address, also can get decimals
  const result = await fetch(
    `https://programs.shyft.to/v0/graphql/accounts?api_key=${SHYFT_API_KEY}&network=mainnet-beta`,
    {
      method: 'POST',
      body: JSON.stringify({
        query: operationsDoc,
        variables: {},
        operationName: 'MyQuery',
      }),
    }
  );

  return await result.json();
}

async function getReserveCurrencyDetails(reserveAddresses) {
  const allCurrencyDetails = new Map();

  const { errors, data } = await getReserveDataByGraphQl(reserveAddresses);
  //get liquidity details such as token addresses and decimals, all at once
  if (errors) {
    console.error(errors);
    return allCurrencyDetails;
  }

  for (const reserve of data.kamino_lending_Reserve) {
    const currencyDetails = {
      success: false,
      address: '',
      decimals: 0,
    };
    try {
      currencyDetails.address = reserve.liquidity.mintPubkey;
      currencyDetails.decimals = reserve.liquidity.mintDecimals;
      currencyDetails.success = true;
      allCurrencyDetails.set(reserve.pubkey, currencyDetails);
    } catch (error) {
      allCurrencyDetails.set(reserve.pubkey, currencyDetails);
    }
  }
  return allCurrencyDetails;
}
function getSfDecimalValue(sfValue) {
  //function converts scaled fraction to decimals
  // fields ending with Sf have scaled fraction format, and they need to be converted to decimal before processing
  return new Decimal(sfValue).div(2 ** 60);
}

export async function getAllYourObligations(walletAddress) {
  const { errors, data } = await getObligationDataByGraphQl(walletAddress);
  //get Obligation Details of the user, which includes borrows, lending and reserve details

  if (errors) {
    console.error(errors);
    return;
  }

  if (data.kamino_lending_Obligation.length == 0) {
    console.error('No Borrows or Deposits found');
    return;
  }

  const reservesSet = new Set();
  for (const obligation of data.kamino_lending_Obligation) {
    /*
        Getting all the reserve addresses from the obligation
    */

    for (const borrowDetails of obligation?.borrows) {
      if (borrowDetails.borrowReserve !== '11111111111111111111111111111111')
        reservesSet.add(borrowDetails.borrowReserve);
    }
    for (const depositDetails of obligation?.deposits) {
      if (depositDetails.depositReserve !== '11111111111111111111111111111111')
        reservesSet.add(depositDetails.depositReserve);
    }
  }

  const allTokenDetails = await getReserveCurrencyDetails(
    Array.from(reservesSet)
  );

  const depositedAssets = [];
  const borrowedAssets = [];

  for (const obligation of data.kamino_lending_Obligation) {
    /*
            Obligation returned contains the borrows for that particular user in an array.
            An user may have multiple obligations, hence looping through them to process all obligations.
        */

    if (obligation.deposits && Array.isArray(obligation.deposits)) {
      for (const depositDetails of obligation?.deposits) {
        if (depositDetails.depositReserve == '11111111111111111111111111111111')
          continue;

        const depositedAsset = allTokenDetails.get(
          depositDetails.depositReserve
        );

        // console.log("Deposited Amount: ", depositDetails.depositedAmount);
        // console.log("Deposited Asset: ", depositedAsset.address);

        if (depositedAsset.success)
          depositedAssets.push({
            amount: (
              depositDetails.depositedAmount /
              10 ** depositedAsset.decimals
            ).toFixed(2),
            tokenAddress: depositedAsset.address,
          });
      }
      for (const borrowDetails of obligation?.borrows) {
        if (borrowDetails.borrowReserve == '11111111111111111111111111111111')
          continue;
        const borrowedAsset = allTokenDetails.get(borrowDetails.borrowReserve);
        const borrowedAmount = getSfDecimalValue(
          borrowDetails.borrowedAmountSf
        );

        // console.log("Borrowed Amount: ", borrowedAmount);
        // console.log("Borrowed Asset: ", currencyDetails.address);
        if (borrowedAsset.success)
          borrowedAssets.push({
            amount: borrowedAmount
              .div(10 ** borrowedAsset.decimals)
              .toDecimalPlaces(2)
              .toString(),
            tokenAddress: borrowedAsset.address,
          });
      }
    }
    //console.log('==================================================');
  }

  return { depositedAssets, borrowedAssets };
}

//getAllData('HNqJtqudHDWiWHWg3RH7FPamf8dyXjFwJVPmfRDMDyjE');
//wallet address for which we are fetching obligations
