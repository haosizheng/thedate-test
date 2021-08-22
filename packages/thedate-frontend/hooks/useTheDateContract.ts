
import type { Web3Provider } from "@ethersproject/providers";
import useSWR from "swr";
import {useWeb3React} from "@web3-react/core";
import { useMemo } from "react";
import { TheDate__factory, TheDate } from '@thefoundation/thedate-contracts/typechain';
import deployments from '@thefoundation/thedate-contracts/deployments/exports.json';

export default function useTheDateContract() {
  const { library, active, account, chainId } =  useWeb3React<Web3Provider>();
  
  

  return useMemo(
    () => !!library && !!chainId && (<any>deployments)[chainId!]
      ? 
        TheDate__factory.connect((<any>deployments)[chainId!].hardhat.contracts.TheDate.address, 
          (!!account ? library.getSigner(account).connectUnchecked() : library)) 
      : undefined, 
    [library, account, chainId]
  );
}