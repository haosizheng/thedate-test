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
      <div className="wallet">
        {active && account ? (
          !!chainId && chainId == NETWORK_CHAIN_ID ? 
            <p>
              Connected as {" "}
              <Link href={`/gallery/${account}`} >
                <a className="hover:link">
                  {ensName || `${shortenHex(account, 4)}`}
                </a>
              </Link>
            </p>
          :
            <p className="">Please switch your Metamask network to {NETWORK_NAMES[Number(process.env.NETWORK_CHAIN_ID || "1")]}!
            </p>
        ) : (
          <p>
            Connect via {" "}
            <button onClick={() => { activate(injected) }} >
              Metamask
            </button>
          </p>
        )}
      </div> 
  )
}
