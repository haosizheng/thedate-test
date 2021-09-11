import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { NETWORK_NAMES } from "@/utils/chains";
import { useMemo } from "react";

export default function ArtworkSVG({ tokenId }: { tokenId: number }) {
  const {chainId} = useActiveWeb3React();
  const Superpower = useSuperpowerContract();
      
  Superpower.generateSVG
  return (

  );
}