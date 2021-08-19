
import type { Web3Provider } from "@ethersproject/providers";
import useSWR from "swr";
import {useWeb3React} from "@web3-react/core";
import { TheDate__factory, TheDate } from '@thefoundation/contracts/typechain';
import { useMemo } from "react";

export default function useTheDateContract(withSigner = false) {
  const { library, account } =  useWeb3React<Web3Provider>();
  return useMemo(
    () => !!library 
      ? 
        TheDate__factory.connect(process.env.THEDATE_ADDRESS!, 
          withSigner && account ? library.getSigner(account).connectUnchecked() : library) 
      : undefined, 
    [library, account, withSigner]
  );
}