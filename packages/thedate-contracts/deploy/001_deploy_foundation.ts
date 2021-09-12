import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer, foundationMember1, foundationMember2 } = await hre.getNamedAccounts();

  console.log("Deployer: ", deployer);

  const FOUNDATION_MEMBERS: string[] = [
    foundationMember1,
    foundationMember2,
  ];
  const FOUNDATION_SHARES: number[] = [600000, 400000];
  
  await hre.deployments.deploy("Foundation", {
    from: deployer,
    args: [FOUNDATION_MEMBERS, FOUNDATION_SHARES],
    log: true
  });
};

func.tags = ["deploy", "FoundationContract"];

export default func;

