import React from "react";
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import Web3ReactManager from "./Web3ReactManager";
import dynamic from 'next/dynamic'

function getLibrary(provider: any) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 15000
  return library
}

const Web3ReactProviderNetwork = dynamic(
  () => import('./Web3ReactProviderNetwork'),
  { ssr: false }
)

export default function AppProviders({ children }: {children: JSX.Element}) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactProviderNetwork getLibrary={getLibrary}>
        <Web3ReactManager>
          {children}
        </Web3ReactManager>
      </Web3ReactProviderNetwork>
    </Web3ReactProvider>
  );
}
