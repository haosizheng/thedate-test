// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';
import { ErrorFragment } from 'ethers/lib/utils';

type Address = string;

export const FOUNDATION_MEMBERS: Address[] = [ "0xcc50cDcd9Dab7A98926B1164Ae5bb59FceFB5AF9", 
"0x6b9A0C57f1aBE412f1a6761A9FCD40cFD1BB2CC3" ];
export const FOUNDATION_SHARES: number[] = [500000, 500000];

export async function deployFoundationContract(payees: Address[], shares: number[]): Promise<Contract> {
  if (!(payees.length > 0 && shares.length > 0 && payees.length == shares.length)) {
    throw new Error("payees or shares is invalid. ");
  }
  const contractFactory = await ethers.getContractFactory('TheDateFoundation');
  const contract = await contractFactory.deploy(payees, shares);
  return await contract.deployed();
}

export async function deployMainContract(foundationContractAddress: Address): Promise<Contract> {
  const contractFactory = await ethers.getContractFactory('TheDate');
  const contract = await contractFactory.deploy(foundationContractAddress);
  return await contract.deployed();
}

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const foundationContract = await deployFoundationContract(FOUNDATION_MEMBERS, FOUNDATION_SHARES);
  console.log("Foundation contract deployed to:", foundationContract.address);

  const mainContract = await deployMainContract(foundationContract.address);
  console.log("Main contract deployed to:", mainContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
