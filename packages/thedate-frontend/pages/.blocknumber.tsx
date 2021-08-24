import Layout from "@/components/Layout";
import useBlockNumber from "@/hooks/useBlockNumber";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import type { ExternalProvider, JsonRpcFetchFunc } from "@ethersproject/providers";
import useEagerConnect from "@/hooks/useEagerConnect";
import { injected } from "@/utils/connectors";
import { useEffect } from "react";
import Wallet from "@/components/Wallet";

function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc): Web3Provider {
  return new Web3Provider(provider);
}

export default function BlockNumber() {
  const { data: blockNumber } = useBlockNumber();
  const tried = useEagerConnect();

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div>
        Blocknumber: {blockNumber ? blockNumber.toString() : ""}
        <Wallet />
      </div>
    </Web3ReactProvider>
  );
}

