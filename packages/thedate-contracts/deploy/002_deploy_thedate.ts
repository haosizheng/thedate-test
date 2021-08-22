import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const TheFoundation_deployment = await deployments.get("TheFoundation");

  await deploy("TheDate", {
    from: deployer,
    args: [TheFoundation_deployment.address],
    log: true,
  });
};
export default func;

func.tags = ["Contract"];
