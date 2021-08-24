
import { useMemo } from "react";
import { TheDate__factory } from '@thefoundation/thedate-contracts/typechain';
import { deployments } from '@thefoundation/thedate-contracts/deployments';
import useActiveWeb3React from "./useActiveWeb3React";

export default function useTheDateContract() {
  const { library, account, chainId } = useActiveWeb3React();

  const TheDate_address = !!chainId && deployments[chainId]?.contracts.TheDate.address;

  return useMemo(
    () => !!library && !!chainId && !!TheDate_address
      ? 
        TheDate__factory.connect(TheDate_address, 
          (!!account ? library.getSigner(account).connectUnchecked() : library)) 
      : undefined, 
    [library, account, chainId]
  );
}
