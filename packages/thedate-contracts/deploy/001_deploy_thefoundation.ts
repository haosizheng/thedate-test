import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

type Address = string;

const FOUNDATION_MEMBERS: Address[] = [
  "0xcc50cDcd9Dab7A98926B1164Ae5bb59FceFB5AF9",
  "0x6b9A0C57f1aBE412f1a6761A9FCD40cFD1BB2CC3",
];
const FOUNDATION_SHARES: number[] = [500000, 500000];

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("TheFoundation", {
    from: deployer,
    args: [FOUNDATION_MEMBERS, FOUNDATION_SHARES],
    log: true,
  });
};
export default func;

func.tags = ["Contract"];
