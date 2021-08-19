import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import useETHBalance from "../hooks/useETHBalance";
import useEtherPrice from "../hooks/useEtherPrice";
import { parseBalance } from "../utils/ethers";

export default function ETHBalance() {
  const { account } = useWeb3React<Web3Provider>();
  const { data: balance } = useETHBalance(account);


  return (
    <>Ξ{balance ? parseBalance(balance): "0.00"} </>
  );
}