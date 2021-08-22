import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected, walletconnect } from '../utils/web3-connectors';
import useENSName from "../hooks/useENSName";
import useEagerConnect from "../hooks/useEagerConnect";
import { formatEtherscanLink, shortenHex } from "../utils/ethers";
import { Web3Provider, Network } from '@ethersproject/providers';
import { getPackedSettings } from 'http2';

export default function Wallet() {
  const { library, chainId, error, account, activate, active  } = useWeb3React<Web3Provider>();

  const ensName = useENSName(account);
  const triedToEagerConnect = useEagerConnect();
  
  if (error) {
    return null;
  }

  return (
      <div>
        {active ? (
          <div className="text-xs">
            <a className="link"
              {...{
                href: formatEtherscanLink("Account", [chainId, account]),
                target: "_blank",
                rel: "noopener noreferrer",
              }}>
              {ensName || `${shortenHex(account, 4)}`}
            </a>
          </div>
        ) : (
          <div className="text-xs">
            <button type="button" onClick={() => { activate(injected) }} >
              <p className="link">Metamask</p>
            </button>
            &nbsp; | &nbsp; 
            <button className="link underline" type="button" onClick={() => { activate(walletconnect) }} >
              Wallet Connect
            </button>
          </div>
        )}
      </div> 
  )
}
