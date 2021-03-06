import { NetworkContextName } from '@/utils/connectors';
import { createWeb3ReactRoot } from '@web3-react/core';

const Web3ReactProviderNetwork = createWeb3ReactRoot(NetworkContextName)

const Web3ReactProviderNetworkSSR = ({ children, getLibrary }: {children: JSX.Element, getLibrary: any}) => {
  return (
    <Web3ReactProviderNetwork getLibrary={getLibrary}>
      {children}
    </Web3ReactProviderNetwork>
  )
}

export default Web3ReactProviderNetworkSSR;
