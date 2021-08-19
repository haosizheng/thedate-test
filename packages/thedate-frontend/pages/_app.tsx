import 'tailwindcss/tailwind.css';

import type { AppProps } from "next/app";
import Layout from '../components/Layout'

import type { ExternalProvider, JsonRpcFetchFunc } from "@ethersproject/providers";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import { NftProvider, useNft } from 'use-nft';
import { getDefaultProvider, Contract } from 'ethers';

function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc): Web3Provider {
  return new Web3Provider(provider);
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3ReactProvider>
  );
}
