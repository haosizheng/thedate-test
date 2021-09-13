import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TheDate } from "../typechain";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "hardhat";

const SECONDS_IN_A_DAY = 86400;

const reservedDateList = [
  //https://emojicombos.com/9%2F11
  {date:"2021-08-27", note:"Loot was launched."}, 
  {date:"2001-09-11", note:"9️⃣1️⃣1️⃣  🛫✈️🛩🏢🏢😨😱😱❗❗💥💥🔥"}, 
  {date:"2015-07-30",note:"Ethereum 1.0 Released"}, 
  {date:"2007-06-29",note:"The first iPhone was released 📱"}, 
  {date:"2017-06-23",note:"CryptoPunks released"}, 
  {date:"2011-10-05",note:"RIP Steve Jobs"}, 
  {date:"2020-01-26",note:"RIP Kobe Bryant (1978-2020)"}, 
  {date:"2009-01-03",note:"The Genesis Block of Bitcoin was mined."}, 
  {date:"2013-06-06",note:"Snowden Reveals Secrets"}, 
  {date:"2013-12-06",note:"#Dogecoin 💎🙌 #ToTheMoon 🚀🚀🚀🚀🌕"}, 
  {date:"2010-05-22",note:"Bitcoin Pizza ₿🛒🍕"},
];

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  const { deployer: deployerAddress } = await hre.getNamedAccounts();
  const theDateAddress = (await hre.deployments.get("TheDate")).address;
  const deployer = await hre.ethers.getSigner(deployerAddress);
  const chainId = await hre.getChainId();

  const theDate = await hre.ethers.getContractAt("TheDate", theDateAddress, deployer) as TheDate;
  const engravingPrice = await theDate.engravingPrice();

  const tokenIds = reservedDateList.map( ({date, note}) => {
    const tokenId = BigNumber.from(new Date(date).valueOf()).div(SECONDS_IN_A_DAY).div(1000);
    return tokenId.toNumber();
  })

  const addresses = reservedDateList.map( _ => deployer.address);

  if (chainId !== "31337") {
    console.log(`Airdrop ${tokenIds.length} tokens`);
    console.log(tokenIds);
  //  console.log( (await hre.ethers.provider.getGasPrice()).toNumber());
    await theDate.airdrop(addresses, tokenIds);//gasPrice: 60000000000}
    console.log(`Airdropped ${tokenIds.length} tokens`);
  }
  else {
    for (const {date, note} of reservedDateList) {
      const tokenId = BigNumber.from(new Date(date).valueOf()).div(SECONDS_IN_A_DAY).div(1000);
      await theDate.claim(tokenId);
      if (note.length > 0) {
        await theDate.engraveNote(tokenId, note, {value: engravingPrice});
      }
      console.log(`${date} with note ${note} (Airdrop tokenId=${tokenId} to ${deployer.address})`);
    }
  }
};

func.tags = ["reserve", "Reservations"];
func.dependencies = ["deploy"];

func.skip = async ({ getChainId }) => {
  const chainId = await getChainId();
  return false;
//  return true;
//  return chainId !== "31337";
}

export default func;

