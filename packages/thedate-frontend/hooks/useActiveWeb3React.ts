import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { NetworkContextName } from '@/utils/connectors'
import { NETWORK_CHAIN_ID } from "@/utils/connectors";

export default function useActiveWeb3React() {
  const context = useWeb3React<Web3Provider>()
  const contextNetwork = useWeb3React<Web3Provider>(NetworkContextName)

  return (context.active && context.chainId == NETWORK_CHAIN_ID) ? context : contextNetwork;
}
