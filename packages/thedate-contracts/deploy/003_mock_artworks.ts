import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { TheDate } from "../typechain";
import { BigNumber } from "@ethersproject/bignumber";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const SECONDS_IN_A_DAY = 86400;

  const { deployments, ethers } = hre;
  const [deployer, user1, user2, user3, user4] = await ethers.getSigners();

  const mainContract = (await ethers.getContractAt("TheDate", (await deployments.get("TheDate")).address)) as TheDate;

  const tokenId = BigNumber.from(
    (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
  ).div(SECONDS_IN_A_DAY);
  
  // The first bid is placed by User1
  await mainContract.connect(user1).placeBid(tokenId, { value: ethers.utils.parseEther("0.1") })
  await mainContract.connect(user2).placeBid(tokenId, { value: ethers.utils.parseEther("0.2") })
  await mainContract.connect(user3).placeBid(tokenId, { value: ethers.utils.parseEther("0.3") })
  await mainContract.connect(user4).placeBid(tokenId, { value: ethers.utils.parseEther("0.4") })

  await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);

  await mainContract.connect(user4).endAuction(tokenId);
  await mainContract.connect(user4).engraveArtworkNote(tokenId, "I love you!");
  await mainContract.connect(user4).eraseArtworkNote(tokenId, { value: ethers.utils.parseEther("1.0") });

  await mainContract.connect(user1).placeBid(tokenId.add(1), { value: ethers.utils.parseEther("0.4") })
  await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);
  await mainContract.connect(user1).endAuction(tokenId.add(1));

  await mainContract.connect(user1).placeBid(tokenId.add(2), { value: ethers.utils.parseEther("0.4") })
  await mainContract.connect(user2).placeBid(tokenId.add(2), { value: ethers.utils.parseEther("1.0") })
  await mainContract.connect(user3).placeBid(tokenId.add(2), { value: ethers.utils.parseEther("2.0") })
  await mainContract.connect(user4).placeBid(tokenId.add(2), { value: ethers.utils.parseEther("3.0") })

  console.log("mock artworks created.")
};

func.tags = ["reserve", "MockArtworks"];

func.skip = async ({ getChainId }) => {
  const chainId = await getChainId();
  return chainId !== "31337";
}

func.dependencies = ["deploy"];

export default func;

