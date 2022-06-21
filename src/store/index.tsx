import { atom } from "recoil";

export const WalletState = atom({
  key: 'walletState',
  default: {
    connected: false,
    loading: false,
    message: "",
    address: "",
    provider: undefined,
  }
})

export const OfferingState = atom({
  key: 'offeringState',
  default: {
    fetched: false,
    loading: false,
    data: {},
  }
})