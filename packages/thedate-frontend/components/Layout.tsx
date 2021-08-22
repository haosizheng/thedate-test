import Meta from './Meta'
import Header from './Header'
import Footer from './Footer'

import type { ExternalProvider, JsonRpcFetchFunc } from "@ethersproject/providers";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";

export interface LayoutProps  { 
  children: React.ReactNode
}

function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc): Web3Provider {
  return new Web3Provider(provider);
}

export default function Layout(props: LayoutProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Meta />
      <main className="min-h-screen bg-neutral text-neutral-content">
        <Header />
        {props.children}
        <Footer />
      </main>
    </Web3ReactProvider>
  );
}
