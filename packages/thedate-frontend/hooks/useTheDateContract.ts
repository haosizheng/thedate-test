
import { useMemo } from "react";
import { TheDate__factory, TheDate } from '@thefoundation/thedate-contracts/typechain';
import deployments from '@thefoundation/thedate-contracts/exports/deployments.json';
import useActiveWeb3React from "./useActiveWeb3React";
import { NETWORK_NAMES } from "@/utils/chains";

export default function useTheDateContract() {
  const { library, account, chainId } = useActiveWeb3React();

  return useMemo(
    () => {
      const TheDate_address = !!chainId ? 
        (<any>deployments)[`${chainId}`][NETWORK_NAMES[chainId]].contracts.TheDate.address : undefined;
      return !!library && !!chainId && !!TheDate_address
        ? TheDate__factory.connect(TheDate_address, 
          (!!account ? library.getSigner(account).connectUnchecked() : library)) 
        : undefined;
    },
    [library, account, chainId]
  );
}
