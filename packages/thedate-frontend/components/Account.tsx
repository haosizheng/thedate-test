import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useENSName from "../hooks/useENSName";
import useConnectAccount from "../hooks/useConnectAccount";
import MetaMaskOnboarding from "@metamask/onboarding";
import { formatEtherscanLink, shortenHex } from "../utils/ethers";

export default function Account({ triedToEagerConnect }) {
  const {
    active,
    error,
    activate,
    chainId,
    account,
    setError,
  } = useWeb3React();
  
  const {hasMetaMaskOrWeb3Available, onMetaMaskConnect, installMetamask} = useConnectAccount();

  const ENSName = useENSName(account);

  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  if (typeof account !== "string") {
    return hasMetaMaskOrWeb3Available ? (
      <a onClick={onMetaMaskConnect}>
          {MetaMaskOnboarding.isMetaMaskInstalled()
              ? "Connect to MetaMask"
              : "Connect to Wallet"}
      </a>
      ) : (
      <a onClick={installMetamask}>
          Install Metamask
      </a>
    );
  }
  
  return (
    <a 
      {...{
        href: formatEtherscanLink("Account", [chainId, account]),
        target: "_blank",
        rel: "noopener noreferrer",
      }}
    >
      {ENSName || `${shortenHex(account, 4)}`}
    </a>
  );
}