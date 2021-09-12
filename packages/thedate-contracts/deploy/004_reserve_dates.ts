import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TheDate } from "../typechain";
import { BigNumber } from "@ethersproject/bignumber";

const SECONDS_IN_A_DAY = 86400;

const reservedDateList = [
  {date:"2021-08-27", note:"On the date Loot was launched."}, 
  {date:"2001-09-11",note:"September 11 Attacks"}, 
  {date:"2015-07-30",note:"Ethereum Initial Released"}, 
  {date:"2007-06-29",note:"The first iPhone was released"}, 
  {date:"2016-11-08",note:"Trump was elected"}, 
  {date:"2017-06-23",note:"CryptoPunks released"}, 
  {date:"2011-10-05",note:"RIP Steve Jobs"}, 
  {date:"2020-01-26",note:"RIP Kobe Bryant"}, 
  {date:"2009-01-03",note:"The first bitcoin transactions – the ‘Genesis Block’ – are mined"}, 
  {date:"2013-06-06",note:"Snowden Reveals Secrets"}, 
  {date:"2010-05-22",note:"An american programmer used 10000 bitcoins to buy 2 pizza"},
];

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  const { deployer: deployerAddress } = await hre.getNamedAccounts();
  const theDateAddress = (await hre.deployments.get("TheDate")).address;
  const deployer = await hre.ethers.getSigner(deployerAddress);

  const theDate = await hre.ethers.getContractAt("TheDate", theDateAddress, deployer) as TheDate;
  const engravingPrice = await theDate.engravingPrice();

  const tokenIds = reservedDateList.map( ({date, note}) => {
    const tokenId = BigNumber.from(new Date(date).valueOf()).div(SECONDS_IN_A_DAY).div(1000);
    return tokenId;
  })

  const addresses = reservedDateList.map( _ => deployer.address);

  await theDate.airdrop(addresses, tokenIds);

  // for (const {date, note} of reservedDateList) {
  //   const tokenId = BigNumber.from(new Date(date).valueOf()).div(SECONDS_IN_A_DAY).div(1000);
  //   await theDate.claim(tokenId);
  //   if (note.length > 0) {
  //     await theDate.engraveNote(tokenId, note, {value: engravingPrice});
  //   }
  //   console.log(`${date} with note ${note} (Airdrop tokenId=${tokenId} to ${deployer.address})`);
  // }
};

func.tags = ["reserve", "Reservations"];
func.dependencies = ["deploy"];

func.skip = async ({ getChainId }) => {
  const chainId = await getChainId();
  return chainId !== "31337";
}

export default func;

