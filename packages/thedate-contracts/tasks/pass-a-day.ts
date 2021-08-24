// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
import { task } from "hardhat/config";

task("pass-a-day", "Pass A day", async (args, hre) => {
  const { ethers } = hre;
  const SECONDS_IN_A_DAY = 86400;

  await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);
});
