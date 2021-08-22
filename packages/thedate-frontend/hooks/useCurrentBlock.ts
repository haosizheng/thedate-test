import type { Web3Provider } from "@ethersproject/providers";
import useSWR from "swr";
import {useWeb3React} from "@web3-react/core";
import useBlockNumber from "./useBlockNumber";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";

export default function useCurrentBlock() {
  const { library } = useWeb3React<Web3Provider>();
  const { data: blockNumber } = useBlockNumber();

  const shouldFetch = !!library && !!blockNumber;

  const result = useSWR(shouldFetch ? ["Block"] : null, 
    async () => {
      return library?.getBlock(blockNumber!);
    }, {
      refreshInterval: 10 * 1000,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
