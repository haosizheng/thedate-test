import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import useBlockNumber from "@/hooks/useBlockNumber";
import useKeepSWRDataLiveAsBlocksArrive from "@/hooks/useKeepSWRDataLiveAsBlocksArrive";
import useSWR from "swr";

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
