import useSWR from "swr";
import useBlockNumber from "./useBlockNumber";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useActiveWeb3React from "./useActiveWeb3React";

export default function useCurrentBlock() {
  const { library } = useActiveWeb3React();
  const { data: blockNumber } = useBlockNumber();

  const shouldFetch = !!library && !!blockNumber;

  const result = useSWR(
    shouldFetch ? ["Block"] : null, 
    async () => {
      return library?.getBlock(blockNumber!);
    }, {
      refreshInterval: 10 * 1000,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
