import Link from "next/link";
import { useWeb3React } from '@web3-react/core'
import { injected, walletconnect } from "@/utils/connectors";
import { shortenHex } from "@/utils/ethers";
import useENSName from "@/hooks/useENSName";

import PendingReturns from "./PendingReturns";

export default function Wallet() {
  const { error, account, activate, active } = useWeb3React();
  const ensName = useENSName(account);
  
  if (error) {
    console.log(error);
  }

  return (
      <div>
        {active ? (
          <div>
            Connected as {" "}
            <Link href={`/gallery/${account}`}>
              <a className="hover:link">
                {ensName || `${shortenHex(account, 4)}`}
              </a>
            </Link>
            <PendingReturns />
          </div>
        ) : (
          <div>
            Connect via {" "}
            <button type="button" className="link" onClick={() => { activate(injected) }} >
              Metamask
            </button>
            {/* {" "} or {" "}
            <button className="link underline" type="button" onClick={() => { activate(walletconnect) }} >
              Wallet Connect
            </button> */}
          </div>
        )}
      </div> 
  )
}
