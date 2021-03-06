import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TheDate } from "../typechain";
import { BigNumber } from "@ethersproject/bignumber";
import chai from "chai";
import { solidity } from "ethereum-waffle";

const expect = chai.expect;
chai.use(solidity);

const SECONDS_IN_A_DAY = 86400;

const reservedDateList = [
  {date:"1989-01-01", note:"😋 😋 😋 😋 😋 "}, 
  {date:"1988-01-01", note:"😋 Get Emoji — All Emojis to ✂️ Copy and 📋 Paste 👌"},
  {date:"1987-01-01", note:'<text x="10" y="10" class="base">ASDASDa</text>'}
];

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  const { deployer: deployerAddress } = await hre.getNamedAccounts();
  const theDateAddress = (await hre.deployments.get("TheDate")).address;
  const deployer = await hre.ethers.getSigner(deployerAddress);

  const theDate = await hre.ethers.getContractAt("TheDate", theDateAddress, deployer) as TheDate;

  for (const {date, note} of reservedDateList) {
    const tokenId = BigNumber.from(new Date(date).valueOf()).div(SECONDS_IN_A_DAY).div(1000);
    await expect(theDate.airdrop([deployer.address], [tokenId]))
      .to.emit(theDate, "ArtworkAirdropped");

    if (note.length > 0) {
      await expect(theDate.engraveNote(tokenId, note))
        .to.emit(theDate, "NoteEngraved");
    }
    console.log(`${date} with note ${note} (Airdrop tokenId=${tokenId} to ${deployer.address})`);
  }
};

func.tags = ["reserve", "Reservations"];
func.dependencies = ["deploy"];

func.skip = async ({ getChainId }) => {
  const chainId = await getChainId();
  return chainId === "1";
//  return true;
}

export default func;

