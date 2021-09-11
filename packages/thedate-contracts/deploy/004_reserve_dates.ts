import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TheDate } from "../typechain";
import { BigNumber } from "@ethersproject/bignumber";

const SECONDS_IN_A_DAY = 86400;

const reservedDateList = [
  {date: "1989-01-09", note: ""},
  {date: "1988-10-22", note: ""}, 
  {date: "1978-08-23", note: "Kobe Bryant's birthday"},
  {date: "2020-01-26", note: "RIP Kobe Bryant"},
  {date: "1970-01-01", note: "Unix Epoch"},
  {date: "2001-09-11", note: "September 11 attacks"},
  {date: "2021-08-27", note: "Loot was launched on the date."}
];

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  const { deployer: deployerAddress } = await hre.getNamedAccounts();
  const theDateAddress = (await hre.deployments.get("TheDate")).address;
  const deployer = await hre.ethers.getSigner(deployerAddress);

  const theDate = await hre.ethers.getContractAt("TheDate", theDateAddress, deployer) as TheDate;
  
  for (const {date, note} of reservedDateList) {
    const tokenId = BigNumber.from(new Date(date).valueOf()).div(SECONDS_IN_A_DAY).div(1000);
    await theDate.airdrop([deployer.address], [tokenId]);
    if (note.length > 0) {
      await theDate.engraveNote(tokenId, note);
    }
  }
};

func.tags = ["reserve", "Reservations"];

func.dependencies = ["deploy"];

export default func;

