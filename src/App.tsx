import { useEffect } from 'react'
import {themeChange} from 'theme-change'
import { useRecoilState } from 'recoil';
import { WalletState } from './store';
import { ethers } from 'ethers';
import { fetchData, sleep } from "./utils";
import ConnectButton from './components/connectbutton';
import OfferingTable from './components/OfferingTable';

function App() {
  const [walletState, setWalletState] = useRecoilState(WalletState);

  const checkNetwork = () => {
    if (window.ethereum === undefined) {
      setWalletState({
        ...walletState,
        connected: false, 
        message: "Metamask is not detected, please make sure EIP compliant wallet installed", 
        address: "",
        loading: false,
      });
    }
  }

  const requestingNetwork = async () => {
    setWalletState({
      ...walletState,
      connected: false, 
      message: "Checking wallet connection", 
      address: "",
      loading: true,
    });
    
    try {
      if (window.ethereum === undefined) {
        return ;
      }
        
      setWalletState({
        ...walletState,
        connected: false, 
        message: "Requesting connection to Avalanche Network (AVAX)", 
        address: "",
        loading: true,
      });
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xA86A' }], // chainId must be in hexadecimal numbers
      });
      setWalletState({
        ...walletState,
        connected: false, 
        message: "Connected to Avalanche Network (AVAX)", 
        address: "",
        loading: false,
      });

    } catch (e: any) {
      setWalletState({
        ...walletState,
        connected: false, 
        message: "Please change to Avalanche Network (AVAX)", 
        address: "",
        loading: false,
      });
      throw Error(e);
    }
  }

  const connectingWallet = async () => {
    let address = "";
    let message = "Connecting your wallet";
    let provider:any = "";
    setWalletState({
      ...walletState,
      connected: false, 
      message: message, 
      address: "",
      loading: true,
    });
    await sleep(300);
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum, "any")
      await provider.send("eth_requestAccounts",[])
      const signer = provider.getSigner()
      address = await signer.getAddress();
      message = `Connected with address ${address}`;
  
    } catch (e: any) {
      address = ""
      message = "Error! Unable to connect"
      throw Error(e);
    } finally {
      setWalletState({
        ...walletState,
        connected: true, 
        message: message, 
        address: "",
        loading: false,
      });
      console.log(provider);
    }
  }

  const connectHandler = async () => {
    try{
      await requestingNetwork();
      await connectingWallet();
      await fetchData();
    } catch (err) {
      console.log(err);
    }
    
  }

  const disconnectWallet = async () => {
    setWalletState({
      ...walletState,
      connected: false, 
      message: "Disconnected from chain network", 
      address: "",
      loading: false,
    });
  }

  const onChangeHandler = () => {
    if (window.ethereum === undefined) {
      return;
    } else {
      window.ethereum.on('accountsChanged', connectHandler);
      window.ethereum.on('chainChanged', connectHandler);

    }
  }

  useEffect(() => {
    checkNetwork();
    
  }, []);

  useEffect(() => {
    themeChange(false);
    onChangeHandler();
    
  }, []);
  
  return (
    <div className="min-h-screen hero bg-base-200">
      <header className="text-center hero-content ">
        <div className="flex flex-col items-center max-w-md gap-4">
          <h1 className="mb-5 text-5xl font-bold ">
            Test Dapps
          </h1>
          <p className="mb-5">
            Welcome to Test Dapps. To see our APY offering please connect your wallet!
          </p>
          <select data-choose-theme className='text-black '>
            <option value="">Change Theme</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="cupcake">Cupcake</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="synthwave">Synthwave</option>
          </select>
          <ConnectButton 
            onDisconnect={() => disconnectWallet()} 
            onConnect={() => connectHandler()}
          />
          <p className="mb-5">{walletState.message}</p>
          {walletState.connected ? <OfferingTable></OfferingTable> : <></>}
        </div>
      </header>  
    </div>
  )
}

export default App
