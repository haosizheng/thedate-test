import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TheDate } from "../typechain";
import { BigNumber } from "@ethersproject/bignumber";

const SECONDS_IN_A_DAY = 86400;

const reservedDateList = [
  {date:"1989-01-09", note:""}, 
  {date:"1988-10-22", note:""}, 
  {date:"2021-08-27", note:"On the date Loot was launched."}, 
  {date:"2001-09-11", note:"September 11 attacks"}, 
  {date:"2015-07-30", note:"Ethereum Initial released"}, 
  {date:"2018-01-24", note:"ERC-721 was released"}, 
  {date:"1971-06-28", note:"Elon Musk birthday"}, 
  {date:"2010-06-04", note:"SpaceX first launch"}, 
  {date:"1989-11-09", note:"Berlin wall falls"}, 
  {date:"1992-02-01", note:"Cold War Ends"}, 
  {date:"2014-03-08", note:"Malaysia Airlines Flight 370"}, 
  {date:"1994-07-05", note:"Amazon.com is Born"}, 
  {date:"1996-07-05", note:"The Dawn of Cloning"}, 
  {date:"1998-09-04", note:"The Age of Google Begins"}, 
  {date:"2000-11-02", note:"International Space Station Opens"}, 
  {date:"2003-03-09", note:"US Crushes Iraq"}, 
  {date:"2004-02-04", note:"Facebook Founded"}, 
  {date:"2007-06-29", note:"The first gen iPhone was released"}, 
  {date:"2009-01-20", note:"America’s First African American President"}, 
  {date:"2011-05-02", note:"Bin Laden was Killed"}, 
  {date:"2012-07-04", note:"The God Particle Is (Probably) Discovered"}, 
  {date:"2013-06-06", note:"Snowden Reveals Secrets"}, 
  {date:"2015-07-14", note:"NASA Flies by Pluto"}, 
  {date:"2016-11-08", note:"Trump was Elected"}, 
  {date:"1989-06-04", note:"1989 Tiananmen Square protests"}, 
  {date:"2017-06-23", note:"CryptoPunks released"}, 
  {date:"2011-10-05", note:"Steve jobs RIP"}, 
  {date:"1984-01-24", note:"First Apple Macintosh was released"}, 
  {date:"2020-01-26", note:"RIP Kobe Bryant"}, 
  {date:"2008-10-31", note:"Bitcoin whitepaper released"}, 
  {date:"2009-01-09", note:"The first open source Bitcoin client was released"}, 
  {date:"2009-01-03", note:"The first bitcoin transactions – the Genesis Block – are mined"}, 
  {date:"2009-10-31", note:"The first bitcoin exchange, the Bitcoin Market, is established"}, 
  {date:"2010-05-22", note:"An american programmer used 10000 bitcoins to buy 2 pizza"}, 
  {date:"2020-12-01", note:"Ethereum 2.0 Phase 0 was launched"}, 
  {date:"2021-03-11", note:"Beeple's artwork was auctioned for $69,346,250"}, 
  {date:"1988-03-14", note:"Stephen Curry was borned"}, 
  {date:"2021-08-28", note:"Stephen Curry brought a Bored Ape Yacht Club NFT with 55 ETH "}, 
  {date:"2018-11-02", note:"Uniswap was publicly announced and deployed to the Ethereum mainnet"}, 
  {date:"2014-05-03", note:"Qauntum - the first NFT"}, 
  {date:"2021-08-30", note:"War in Afghanistan ends"}, 
  {date:"1992-11-05", note:"Odell Beckham Jr. was borned"}, 
  {date:"2009-01-12", note:"The first bitcoin transaction takes place"}, 
  {date:"2012-06-20", note:"Coinbase was founded"}, 
  {date:"2013-12-06", note:"Dogecoin was released"}, 
  {date:"1983-01-01", note:"Birthday of the Internet"}
];

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  const { deployer: deployerAddress } = await hre.getNamedAccounts();
  const theDateAddress = (await hre.deployments.get("TheDate")).address;
  const deployer = await hre.ethers.getSigner(deployerAddress);

  const theDate = await hre.ethers.getContractAt("TheDate", theDateAddress, deployer) as TheDate;
  const engravingPrice = await theDate.engravingPrice();

  for (const {date, note} of reservedDateList) {
    const tokenId = BigNumber.from(new Date(date).valueOf()).div(SECONDS_IN_A_DAY).div(1000);
    await theDate.airdrop([deployer.address], [tokenId]);
    if (note.length > 0) {
      await theDate.engraveNote(tokenId, note, {value: engravingPrice});
    }
    console.log(`${date} with note ${note} (Airdrop tokenId=${tokenId} to ${deployer.address})`);
  }
};

func.tags = ["reserve", "Reservations"];
func.dependencies = ["deploy"];

func.skip = async ({ getChainId }) => {
  const chainId = await getChainId();
  return chainId !== "31337";
}

export default func;

