import useENSName from "@/hooks/useENSName";
import { NETWORK_NAMES } from "@/utils/chains";
import { injected, NETWORK_CHAIN_ID } from "@/utils/connectors";
import { shortenHex } from "@/utils/ethers";
import { useWeb3React } from '@web3-react/core';
import Link from "next/link";

export default function Wallet() {
  const { error, account, activate, active, chainId } = useWeb3React();
  const ensName = useENSName(account);
  
  if (error) {
    console.log(error);
  }

  return (
      <div id="#wallet">
        {active ? (
          !!chainId && chainId == NETWORK_CHAIN_ID ? 
            <div>
              Connected as {" "}
                <a className="hover:link">
                  {ensName || `${shortenHex(account, 4)}`}
                </a>
            </div>
          :
            <div className="text-xs">Please switch your Metamask network to {NETWORK_NAMES[Number(process.env.NETWORK_CHAIN_ID || "1")]}!
            </div>
        ) : (
          <div>
            Connect via {" "}
            <button type="button" className="link" onClick={() => { activate(injected) }} >
              Metamask
            </button>
          </div>
        )}
      </div> 
  )
}
