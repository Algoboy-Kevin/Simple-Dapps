import { useEffect } from 'react'
import {themeChange} from 'theme-change'
import { useRecoilState } from 'recoil';
import { WalletState, OfferingState } from './store';
import { ethers } from 'ethers';
import { fetchData, sleep } from "./utils";
import ConnectButton from './components/ConnectButton';
import OfferingTable from './components/OfferingTable';

function App() {
  const [walletState, setWalletState] = useRecoilState(WalletState);
  const [offeringState, setOfferingState] = useRecoilState(OfferingState);

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

  const fetchingTableData = async () => {
    setOfferingState({
      ...offeringState,
      fetched: false,
      loading: false,
      data: {},
    });
    let data = {};
    let fetched = false;
    try {
      setOfferingState({
        ...offeringState,
        fetched: false,
        loading: true,
        data: data,
      });
      data = await fetchData();
      fetched = true;
    } catch(err: any) {
      throw Error(err);
    } finally {
      setOfferingState({
        ...offeringState,
        fetched: fetched,
        loading: false,
        data: data,
      });
    }
  }

  const connectHandler = async () => {
    disconnectWallet();
    
    try{
      await requestingNetwork();
      await connectingWallet();
      await fetchingTableData();
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

    setOfferingState({
      ...offeringState,
      fetched: false,
      loading: false,
      data: {},
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
    <div className="w-screen h-screen hero bg-gradient-to-bl from-base-100 to-primary-focus">
      <div className="max-w-full p-3 mx-auto ">
        <header className="text-center border-2 hero-content border-neutral">
          <div className="flex flex-col items-center max-w-md gap-2 ">
            <h1 className="mb-5 text-5xl font-bold ">
              Simple Dapps
            </h1>
            <h1 >
              Welcome to Simple Dapps. To see our APY offering please connect your browser wallet!
            </h1>
            <div className="flex flex-col gap-1 mb-3">
              
            <p>Theme selector 🥳</p>
              <select data-choose-theme className='text-sm text-black '>
                <option value="">Change Theme</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="cupcake">Cupcake</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="synthwave">Synthwave</option>
              </select>
            </div>

            <ConnectButton 
              onDisconnect={() => disconnectWallet()} 
              onConnect={() => connectHandler()}
            />
            <p className="mb-5 overflow-hidden w-80 text-ellipsis">
              {walletState.message}
            </p>
            
            {
              walletState.connected ? 
                offeringState.loading? 
                  <p>Loading table...</p> : offeringState.fetched ? 
                    <OfferingTable></OfferingTable> : <p>There's no staking offering</p>
              : <></>
            }
          </div>
        </header>
      </div>  
    </div>
  )
}

export default App
