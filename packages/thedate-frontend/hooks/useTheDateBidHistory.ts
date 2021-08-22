import type { Web3Provider } from "@ethersproject/providers";
import useSWR from "swr";
import {useWeb3React} from "@web3-react/core";
import { TheDate__factory, TheDate } from '@thefoundation/contracts/typechain';
import { BigNumberish } from "ethers";
import useTheDateContract from "./useTheDateContract"; 
import useCurrentBlock from "../hooks/useCurrentBlock"; 

export default function useTheDateBidHistory(tokenId: BigNumberish | undefined) {
  const { library } = useWeb3React<Web3Provider>();
  const contractOfTheDate = useTheDateContract();
  
  const shouldFetch = !!library && !!contractOfTheDate && !!tokenId;
  const filter = contractOfTheDate?.filters.BidPlaced(tokenId, null, null);
  
  return useSWR(shouldFetch ? ["BidHistory"] : null, async () => {
    return contractOfTheDate?.queryFilter(filter!);
  }, {
    refreshInterval: 10 * 1000,
  });
}
