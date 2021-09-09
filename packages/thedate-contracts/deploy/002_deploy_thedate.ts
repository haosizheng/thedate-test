import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId} = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const foundationAddress = (await deployments.get("TheFoundation")).address;

  await deploy("TheDate", {
    from: deployer,
    args: [foundationAddress],
    log: true
  });
};

func.tags = ["MainContract", "deploy"];
func.dependencies = ["FoundationContract"];

export default func;

