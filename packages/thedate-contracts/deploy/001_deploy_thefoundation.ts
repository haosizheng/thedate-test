import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy } = deployments;
  const chainId = await getChainId();

  const { deployer, foundationMember1, foundationMember2 } = await getNamedAccounts();

  console.log("Deployer: ", deployer);

  const FOUNDATION_MEMBERS: string[] = [
    foundationMember1,
    foundationMember2,
  ];
  const FOUNDATION_SHARES: number[] = [700000, 300000];
  
  await deploy("TheFoundation", {
    from: deployer,
    args: [FOUNDATION_MEMBERS, FOUNDATION_SHARES],
    log: true
  });
};

func.tags = ["deploy", "FoundationContract"];

export default func;

