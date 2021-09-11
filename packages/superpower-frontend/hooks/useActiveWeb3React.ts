import { NetworkContextName, NETWORK_CHAIN_ID } from "@/utils/connectors";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

export default function useActiveWeb3React() {
  const context = useWeb3React<Web3Provider>();
  const contextNetwork = useWeb3React<Web3Provider>(NetworkContextName);

  return (context.active && context.chainId == NETWORK_CHAIN_ID) ? context : contextNetwork;
}
