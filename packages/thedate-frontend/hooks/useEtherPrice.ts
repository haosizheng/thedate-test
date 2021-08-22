import type { EtherscanProvider } from "@ethersproject/providers";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import useSWR from "swr";

export default function useEtherPrice() {

  let etherscanProvider = new ethers.providers.EtherscanProvider("homestead");
  const shouldFetch = !!etherscanProvider;

  const result = useSWR(shouldFetch ? ["EtherPrice"] : null, 
    async () => {
      return etherscanProvider.getEtherPrice()
    }, {
      refreshInterval: 10 * 1000,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
