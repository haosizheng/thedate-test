import deployments from "@/../thedate-contracts/exports/deployments.json";
import { NETWORK_NAMES } from "@/utils/chains";

export function getSuperpowerContractAddress(chainId: number) {
  const Superpower_address = !!chainId ? 
    (<any>deployments)[`${chainId}`][NETWORK_NAMES[chainId]].contracts.Superpower.address : undefined;
  return Superpower_address;
}
