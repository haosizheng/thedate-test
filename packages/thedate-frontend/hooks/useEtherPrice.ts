import type { Web3Provider } from "@ethersproject/providers";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";

function getEtherPrice(library?: Web3Provider) { 
  return ;
}

export default function useEtherPrice() {
  const { library } = useWeb3React<Web3Provider>();
  const shouldFetch = !!library;

  const result = useSWR(shouldFetch ? ["EtherPrice"] : null, 
    async () => {
      return library?.getEtherPrice()
    }, {
      refreshInterval: 10 * 1000,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
