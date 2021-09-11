import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer, weth, loot } = await hre.getNamedAccounts();
  const foundation = (await hre.deployments.get("Foundation")).address;

  await hre.deployments.deploy("TheDate", {
    from: deployer,
    args: [foundation, weth, loot],
    log: true
  });
};

func.tags = ["deploy", "TheDateContract"];
func.dependencies = ["FoundationContract"];

export default func;

