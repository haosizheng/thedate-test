
import deployments from "@/../thedate-contracts/exports/deployments.json";
import { IERC721__factory } from "@/../thedate-contracts/typechain";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { NETWORK_NAMES } from "@/utils/chains";
import { useMemo } from "react";

export default function useLootContract() {
  const { library, account, chainId } = useActiveWeb3React();

  return useMemo(
    () => {
      const Loot_address = chainId === 1 ? 
        "0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7" :
        chainId === 4 ? 
        "0x79e2d470f950f2cf78eef41720e8ff2cf4b3cd78"
      : undefined;
      return !!library && !!chainId && !!Loot_address
        ? IERC721__factory.connect(Loot_address, 
          (!!account ? library.getSigner(account).connectUnchecked() : library)) 
        : undefined;
    },
    [library, account, chainId]
  );
}
