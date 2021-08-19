import type { Web3Provider } from "@ethersproject/providers";
import useSWR from "swr";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import {useWeb3React} from "@web3-react/core";

export default function useETHBalance(address?: string | null, suspense = false) {
  const { library, chainId } = useWeb3React();

  const shouldFetch = typeof address === "string" && !!library;

  const result = useSWR(
    shouldFetch ? ["ETHBalance", address, chainId] : null,
    async (_: string, address: string) => {
      return library?.getBalance(address);
    }, {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}