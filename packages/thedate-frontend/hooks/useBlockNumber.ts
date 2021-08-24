import useSWR from "swr";
import useActiveWeb3React from "./useActiveWeb3React";

export default function useBlockNumber() {
  const { library } = useActiveWeb3React();
  const shouldFetch = !!library;

  return useSWR(
    shouldFetch ? ["BlockNumber"] : null, 
    async () => {
      return library?.getBlockNumber();
    }, {
      refreshInterval: 10 * 1000,
    }
  );
}
