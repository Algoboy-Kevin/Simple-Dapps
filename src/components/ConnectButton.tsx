import { useRecoilState } from 'recoil';
import { WalletState } from '../store';

const ConnectButton = (props:any) => {
  const [walletState, setWalletState] = useRecoilState(WalletState);
  const style = walletState.loading ? "btn btn-disabled" : walletState.connected ? "btn btn-secondary" : "btn btn-primary";
  const message = walletState.loading? "Loading" : walletState.connected ? "Disconnect" : "Connect";

  const onClickHandler = async () => {
    if (walletState.connected) {
      props.onDisconnect();
    } else {
      props.onConnect();
    }
  }
  return (
    <button 
      className={style}
      onClick={() => onClickHandler()}
    >
      {message}
    </button>
  )
}

export default ConnectButton;