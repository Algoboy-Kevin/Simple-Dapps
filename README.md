# Simple Dapps

This is repository for Simple Dapps. This application purpose is to demostrate the apps features to connect to blockchain and fetch data from smart contracts. This apps will request connection to your browser wallet (i.e metamask) and switch you to Avalance Network (AVAX)

## 🔧 Setting up local development

```sh
# Install dependencies
npm install

# To start
npm run dev

# Happy hacking!

```

## 📻 Features

Below are key feature of the apps:
    1. Wallet connection
    2. AAVE APY offering table

## 🛬 Smart Contract References

Offering data is fetched directly from AAVE smart contracts. Below are the details of each smart contract.

| Smart Contract | Address | Description | 
| --- | --- |
| UI Incentive Data Provider V3 | [0x270f51cf3F681010B46f5c4Ee2aD5120Db33026F](https://snowtrace.io/address/0x270f51cf3F681010B46f5c4Ee2aD5120Db33026F#code) | AAVE Helper contract for retrieving incentive data |
| Pool Data Provider | [0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654](https://snowtrace.io/address/0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654#readContract) | AAVE Helper contract for pool data |
| Price Oracle V3 | [0xEBd36016B3eD09D4693Ed4251c67Bd858c3c7C9C](https://snowtrace.io/address/0xEBd36016B3eD09D4693Ed4251c67Bd858c3c7C9C#readContract) | AAVE Helper contract for token pricing  |
