import { EtherscanProvider } from "@ethersproject/providers";
import useKeepSWRDataLiveAsBlocksArrive from "@/hooks/useKeepSWRDataLiveAsBlocksArrive";
import { useMemo } from "react";
import useSWR from "swr";

export default function useEtherPrice() {
  const etherscanProvider = useMemo(() => new EtherscanProvider("homestead", process.env.ETHERSCAN_API_KEY), []);
  const shouldFetch = !!etherscanProvider;

  const result = useSWR(
    shouldFetch ? ["EtherPrice"] : null, 
    async () => {
      return etherscanProvider.getEtherPrice()
    }, {
      refreshInterval: 100 * 1000,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
