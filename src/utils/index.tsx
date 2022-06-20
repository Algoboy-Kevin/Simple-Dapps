import { ethers, BigNumberish } from "ethers";
import contract from "../asset/contracts";


export const sleep = (m:number) => new Promise(r => setTimeout(r, m));

export const normalizeSupply = (number:BigNumberish, decimal:number) => {
  const result = ethers.utils.formatUnits(number, decimal);
  return +result;
}

export const fetchData = async () => {
  const incentiveDataContract = contract.incentiveData();
  const poolDataContract = contract.poolData();
  const incentiveDataAggregate = await incentiveDataContract.getReservesIncentivesData("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb");
  let finalData = [];
  for (const offering of incentiveDataAggregate) {
    const address = offering[0];
    const incentiveData = offering.aIncentiveData.rewardsTokenInformation[0];
    console.log(incentiveData);
    const poolData = await poolDataContract.getReserveData(address);

    const liquidityRate = poolData.liquidityRate.toString();
    const liquidityRateNormalized = normalizeSupply(liquidityRate,27); //RAY to Number

    const emissionPerSec = incentiveData.emissionPerSecond.toString();
    const emissionPerSecNormalized = normalizeSupply(emissionPerSec,18); //WAD to Number

    const object = {address, incentiveData, emissionPerSecNormalized, liquidityRateNormalized};
    finalData.push(object);
    

  }
  console.log(finalData);
}

