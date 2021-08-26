
import deployments from "@/../thedate-contracts/exports/deployments.json";
import { TheDate__factory } from "@/../thedate-contracts/typechain";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { NETWORK_NAMES } from "@/utils/chains";
import { useMemo } from "react";

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
