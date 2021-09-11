import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TheDate } from "../typechain";
import { BigNumber } from "@ethersproject/bignumber";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  const { reservedDateList } = [
    {"1989-01-09", ""}, // Amber's Birthday
    "1988-10-22", // 
    //https://en.wikipedia.org/wiki/Kobe_Bryant
    {"1978-08-23", "Kobe Bryant's birthday"}
    {"2020-01-26", "RIP Kobe Bryant"},
    {"1970-01-01", "Unix Epoch"}
    {"2001-09-11", "September 11 attacks"}
    {"2021-08-27", "Loot was launched on the date."}
  ];

  const { deployer, weth, loot } = await hre.getNamedAccounts();
  const foundation = (await hre.deployments.get("TheFoundation")).address;

  const theDate = await hre.ethers.getContractAt("TheDate", theDateAddress, deployer) as TheDate;

  const theDateAddress = (await deployments.get("TheDate")).address;
  const mainContract = (await ethers.getContractAt("TheDate", theDateAddress, deployer) as TheDate;
};

func.tags = ["reserve", "Reservations"];

func.dependencies = ["deploy"];

export default func;

