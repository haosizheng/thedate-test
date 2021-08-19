import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const TheFoundation = await deployments.get("TheFoundation");
  const TheNote = await deployments.get("TheNote");

  await deploy("TheNoteProofOfBelief", {
    from: deployer,
    args: [TheFoundation.address, TheNote.address],
    log: true,
  });
};
export default func;
func.tags = ["TheNoteProofOfBelief"];
