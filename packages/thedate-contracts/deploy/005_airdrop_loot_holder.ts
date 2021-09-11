import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ERC721Enumerable, TheDate } from "../typechain";
import { BigNumber } from "@ethersproject/bignumber";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer: deployerAddress, loot: lootAddress } = await hre.getNamedAccounts();
  const theDateAddress = (await hre.deployments.get("TheDate")).address;
  const deployer = await hre.ethers.getSigner(deployerAddress);

  const theDate = await hre.ethers.getContractAt("TheDate", theDateAddress, deployer) as TheDate;
  const loot = await hre.ethers.getContractAt("ERC721", lootAddress, deployer) as ERC721Enumerable;
  for (let i = 1; i <= 7777; i++) {
    const owner = await loot.ownerOf(i);
    await theDate.airdrop([owner], [i]);
  }
};

func.tags = ["promote", "AirdropToLootHolder"];
func.dependencies = ["reserve"];

export default func;

