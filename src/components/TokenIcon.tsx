import { DaiIcon, LinkIcon, UsdcIcon, UsdtIcon, WbtcIcon, WethIcon, AaveIcon, WavaxIcon } from "../asset/svg";

const TokenIcon = (props:any) => {
  const style = props.className;
  switch (props.tokenName) {
    case "dai":
      return (<DaiIcon className={style}/>);
    case "link":
      return (<LinkIcon className={style}/>);
    case "usdc":
      return (<UsdcIcon className={style}/>);
    case "usdt":
        return (<UsdtIcon className={style}/>);
    case "wbtc":
      return (<WbtcIcon className={style}/>);
    case "weth":
      return (<WethIcon className={style}/>);
    case "aave":
      return (<AaveIcon className={style}/>);
    case "wavax":
      return (<WavaxIcon className={style}/>);
    default: 
      return (<AaveIcon className={style}/>);
  }
}

export default TokenIcon;