import { ethers } from "ethers";
import IncentiveDataContract from "./IncentiveData";
import PoolDataContract from "./PoolData";

const provider = () => {return new ethers.providers.Web3Provider(window.ethereum, "any")};

const contract = {
  incentiveData: () => new ethers.Contract(
    IncentiveDataContract.address, 
    IncentiveDataContract.abi, 
    provider()
  ).attach(IncentiveDataContract.address),
  poolData: () => new ethers.Contract(PoolDataContract.address, PoolDataContract.abi, provider()).attach(PoolDataContract.address),
}

export default contract;