import { ethers } from "ethers";
import IncentiveDataContract from "./IncentiveData";
import PoolDataContract from "./PoolData";
import PriceOracleContract from "./PriceOracle";

const provider = () => {return new ethers.providers.Web3Provider(window.ethereum, "any")};

const contract = {
  incentiveData: () => new ethers.Contract(
    IncentiveDataContract.address, 
    IncentiveDataContract.abi, 
    provider()
  ).attach(IncentiveDataContract.address),
  poolData: () => new ethers.Contract(
    PoolDataContract.address, 
    PoolDataContract.abi, 
    provider()
  ).attach(PoolDataContract.address),
  priceOracle: () => new ethers.Contract(
    PriceOracleContract.address, 
    PriceOracleContract.abi, 
    provider()
  ).attach(PriceOracleContract.address),
}

export default contract;