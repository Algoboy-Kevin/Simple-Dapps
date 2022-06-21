import { Offering } from "../interface";
import { useRecoilState } from 'recoil';
import { OfferingState } from '../store';
import { useEffect } from "react";
import format from "../utils/formatting";
import { WavaxIcon } from "../asset/svg";
import TokenIcon from "./TokenIcon";

const TableRow = (props:{data:Offering}) => {
  const offering = props.data;

  return ( 
    <tr>
      <th className="bg-transparent"><TokenIcon tokenName={offering.tokenName} className="w-7 h-7"/></th>
      <td  className="bg-transparent">{offering.tokenName}</td>
      <td  className="bg-transparent">
        <div className="flex flex-col items-center">
        <p className="">{format.percentage(offering.depositAPY)}</p>
          <div className="text-xs badge badge-outline">
            <span>{format.percentage(offering.incentiveAPY)}</span>
            <div className="tooltip" data-tip="Annual rewards from WAVAX">
              <div><WavaxIcon className="w-3 h-3 ml-1"/></div>
            </div>
            
          </div>
        </div>
        
      </td>
      <td  className="bg-transparent">Details</td>
    </tr>
  )
}

const OfferingTable = () => {
  const [offeringState, setOfferingState] = useRecoilState(OfferingState);
  const data = offeringState.data;
  const dataArray:any[] = Object.values(data);

  useEffect(() => {
    console.log(data,dataArray);
  },[])


  const TableRows = () => {
    return (
    <>
      {dataArray.map((offer,key) => (<TableRow data={offer} key={key}></TableRow>))}
    </>
    )
  }
    
  
  return (
    <div className="p-2 border-2 border-dashed border-neutral">
      <div className="flex flex-col items-center max-w-full w-80">
      <div className="w-full overflow-x-auto">
        <table className="table table-compact">
          <thead className="relative w-full">
            <tr >
              <th className="bg-transparent"></th>
              <th className="bg-transparent pr-11">Assets</th>
              <th className="bg-transparent">Deposit APY</th>
              <th className="bg-transparent"></th>
            </tr>
          </thead>
        </table>
        <div className="overflow-x-auto h-80">
          <table className="table w-full table-compact">
            <thead className="relative ">
      
            </thead>
            <tbody className="">
              <TableRows/>
            </tbody>
          </table>

        </div>
      </div>
      </div>
  </div>
  )
}

export default OfferingTable;