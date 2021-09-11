import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TheDate } from "../typechain";
import { BigNumber } from "@ethersproject/bignumber";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const SECONDS_IN_A_DAY = 86400;

  const { ethers } = hre;
  const { deployer: deployerAddress } = await hre.getNamedAccounts();
  const [ user1Address, user2Address, user3Address, user4Address ] = await hre.getUnnamedAccounts();
  const user1 = hre.ethers.provider.getSigner(user1Address);
  const user2 = hre.ethers.provider.getSigner(user2Address);
  const user3 = hre.ethers.provider.getSigner(user3Address);
  const user4 = hre.ethers.provider.getSigner(user4Address);

  const theDateAddress = (await hre.deployments.get("TheDate")).address;
  const deployer = await hre.ethers.getSigner(deployerAddress);

  const theDate = await hre.ethers.getContractAt("TheDate", theDateAddress, deployer) as TheDate;

  const tokenId = await theDate.getCurrentAuctionTokenId();
   
  // The first bid is placed by User1
  await theDate.connect(user1).placeBid({ value: ethers.utils.parseEther("0.1") });
  await theDate.connect(user2).placeBid({ value: ethers.utils.parseEther("0.2") });
  await theDate.connect(user3).placeBid({ value: ethers.utils.parseEther("0.3") });
  await theDate.connect(user4).placeBid({ value: ethers.utils.parseEther("0.4") });

  await hre.ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);

  await theDate.connect(user4).settleLastAuction();
  await theDate.connect(user4).engraveNote(tokenId, "I love you!", { value: ethers.utils.parseEther("1.0") });
  await theDate.connect(user4).eraseNote(tokenId, { value: ethers.utils.parseEther("1.0") });

  await theDate.connect(user1).placeBid({ value: ethers.utils.parseEther("0.4") });

  await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);
  await theDate.connect(user1).settleLastAuction();

  await theDate.connect(user1).placeBid({ value: ethers.utils.parseEther("0.4") });
  await theDate.connect(user2).placeBid({ value: ethers.utils.parseEther("1.0") });
  await theDate.connect(user3).placeBid({ value: ethers.utils.parseEther("2.0") });
  await theDate.connect(user4).placeBid({ value: ethers.utils.parseEther("3.0") });

  console.log("mock artworks created.")
};

func.tags = ["test", "MockArtworks"];

func.skip = async ({ getChainId }) => {
  const chainId = await getChainId();
  return chainId !== "31337";
}

func.dependencies = ["deploy"];

export default func;
