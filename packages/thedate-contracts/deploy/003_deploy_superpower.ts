import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const foundation = (await hre.deployments.get("Foundation")).address;

  await hre.deployments.deploy("Superpower", {
    from: deployer,
    args: [foundation],
    log: true
  });
};

func.tags = ["deploy", "SuperpowerContract"];
func.dependencies = ["FoundationContract"];

export default func;
