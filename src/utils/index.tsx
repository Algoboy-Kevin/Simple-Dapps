import { ethers, BigNumberish, BigNumber } from "ethers";
import contract from "../asset/contracts";

const SECONDS_PER_YEAR = 31536000;
const RAY_DECIMALS = 27;
const WAD_DECIMALS = 18; // OR WEI

export const sleep = (m:number) => new Promise(r => setTimeout(r, m));

export const normalizeSupply = (number:BigNumberish, decimal:number) => {
  const result = ethers.utils.formatUnits(number, decimal);
  return +result;
}

export const toBigNumber = (number:number, decimal:number) => {
  const numToString = number.toString();
  const result = ethers.utils.parseUnits(numToString, decimal);
  return result;
}

export const addressToName = {
  "0xd586e7f844cea2f87f50152665bcbc2c279d8d70" : "dai",
  "0x5947bb275c521040051d82396192181b413227a3" : "link",
  "0x50b7545627a5162f82a992c33b87adc75187b218" : "wbtc", 
  "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab" : "weth",
  "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7" : "usdt",
  "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e" : "usdc",
  "0x63a72806098bd3d9520cc43356dd78afe5d386d9" : "aave",
  "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7" : "wavax",
  "0x2b2c81e08f1af8835a78bb2a90ae924ace0ea4be" : "savax"
}

export const fetchData = async () => {
  const incentiveDataContract = contract.incentiveData();
  const poolDataContract = contract.poolData();
  const priceOracleContract = contract.priceOracle();
  const incentiveDataAggregate = await incentiveDataContract.getReservesIncentivesData("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb");

  //Fetching Token Prices
  let addresses = [];
  for (const data of incentiveDataAggregate ) {
    const address = data[0].toLowerCase();
    addresses.push(address);
  }

  const assetsPrices = await priceOracleContract.getAssetsPrices(addresses);
  let prices:any = {};
  for (let i = 0; i < addresses.length; i++) {
    const tokenAddress = addresses[i];
    const price = assetsPrices[i];
    prices[tokenAddress] = price; 
  }

  // Fetching Offerings
  let offerings:any = {};
  for (const offering of incentiveDataAggregate) {

    const address = offering[0].toLowerCase();
    const tokenName = addressToName[address];
    const incentiveData = offering.aIncentiveData.rewardsTokenInformation[0];
    const poolData = await poolDataContract.getReserveData(address);
    if (incentiveData == undefined) {
      continue;
    }
    
    const underlyingTokenDecimals = incentiveData.precision;
    const rewardTokenDecimals = incentiveData.rewardTokenDecimals;
    const rewardPriceFeedDecimals = incentiveData.rewardPriceFeedDecimals;

    //Deposit Calculations
    //APY and APR are returned here as decimals

    const liquidityRate = poolData.liquidityRate.toString();
    const depositAPR = normalizeSupply(liquidityRate, RAY_DECIMALS); //RAY to Number
    const depositAPY = ((1 + (depositAPR / SECONDS_PER_YEAR))**SECONDS_PER_YEAR) - 1;

    //Incentive Calculations

      //Big Numbers
    const emissionPerSec = incentiveData.emissionPerSecond;
    const rewardPrice = incentiveData.rewardPriceFeed; 
    const underlyingTokenSupply = poolData.totalAToken;
    const tokenPrice = prices[address];

      //Big Number Normalized
    const emissionPerSecNormalized = normalizeSupply(emissionPerSec, rewardTokenDecimals);
    const rewardPriceNormalized = normalizeSupply(rewardPrice, rewardPriceFeedDecimals);
    const underlyingTokenSupplyNormalized = normalizeSupply(underlyingTokenSupply, underlyingTokenDecimals);
    const tokenPriceNormalized = normalizeSupply(tokenPrice, WAD_DECIMALS);

      //Calculation
    const emissionPerYear = emissionPerSecNormalized * SECONDS_PER_YEAR;
    const incentiveAPR = (emissionPerYear * rewardPriceNormalized) / (underlyingTokenSupplyNormalized * tokenPriceNormalized);
    const incentiveAPY = ((1 + (incentiveAPR/SECONDS_PER_YEAR))**SECONDS_PER_YEAR) - 1;
    const object = {tokenName, address, depositAPR, depositAPY, incentiveAPR, incentiveAPY};
    offerings[tokenName] = {...object};
  }
  return offerings;
}

