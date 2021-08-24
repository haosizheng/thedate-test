import { EtherscanProvider } from "@ethersproject/providers";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useSWR from "swr";
import { useMemo } from "react";

export default function useEtherPrice() {
  const etherscanProvider = useMemo(() => new EtherscanProvider("homestead"), []);
  const shouldFetch = !!etherscanProvider;

  const result = useSWR(
    shouldFetch ? ["EtherPrice"] : null, 
    async () => {
      return etherscanProvider.getEtherPrice()
    }, {
      refreshInterval: 10 * 1000,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
