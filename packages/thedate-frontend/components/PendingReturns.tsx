import { useState, useRef } from "react";
import { useAsync } from "react-use";
import { parseBalance } from "@/utils/ethers";
import useTheDateContract from "@/hooks/useTheDateContract";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";

export default function PendingReturns() {
  const { account } = useWeb3React();
  const TheDate = useTheDateContract();
  const [pendingReturns, setPendingReturns] = useState<BigNumber | null>(null);
  const onClickToWithdrawFund = async () => {
    await TheDate?.withdrawFund();
  };

  useAsync(async () => {
    if (!account || !TheDate) {
      return;
    }
    const pendingReturns_ = await TheDate.getPendingReturns(account);
    if (!!pendingReturns_) {
      setPendingReturns(pendingReturns_);
    }
  }, [account]);
  return (
    <>
      { !!pendingReturns && !pendingReturns.isZero()  && 
      <div>
      <button className="hover:link" onClick={onClickToWithdrawFund}>Pending Ξ{ parseBalance(pendingReturns) } for refund. </button> 
      </div>}
    </>
  );
}
