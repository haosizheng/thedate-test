// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
import { task } from "hardhat/config";

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress(), " ", (await account.getBalance()).toString());
  }
});