
import deployments from "@/../thedate-contracts/exports/deployments.json";
import { Superpower__factory } from "@/../thedate-contracts/typechain";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { NETWORK_NAMES } from "@/utils/chains";
import { useMemo } from "react";

export default function useSuperpowerContract() {
  const { library, account, chainId } = useActiveWeb3React();

  return useMemo(
    () => {
      const Superpower_address = !!chainId ? 
        (<any>deployments)[`${chainId}`][NETWORK_NAMES[chainId]].contracts.Superpower.address : undefined;
      return !!library && !!chainId && !!Superpower_address
        ? Superpower__factory.connect(Superpower_address, 
          (!!account ? library.getSigner(account).connectUnchecked() : library)) 
        : undefined;
    },
    [library, account, chainId]
  );
}
