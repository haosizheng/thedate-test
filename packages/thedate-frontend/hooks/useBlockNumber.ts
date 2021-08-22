import type { Web3Provider } from "@ethersproject/providers";
import useSWR from "swr";
import { useWeb3React } from "@web3-react/core";

export default function useBlockNumber() {
  const { library } = useWeb3React<Web3Provider>();
  const shouldFetch = !!library;

  return useSWR(shouldFetch ? ["BlockNumber"] : null, 
    async () => {
      return library?.getBlockNumber();
    }, {
      refreshInterval: 10 * 1000,
    }
  );
}
