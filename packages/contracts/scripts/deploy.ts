// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';
import { ErrorFragment } from 'ethers/lib/utils';
import { TheFoundation__factory, TheNote__factory, TheDate__factory, TheNoteProofOfBelief__factory  } from "../typechain";

type Address = string;

export const FOUNDATION_MEMBERS: Address[] = [ 
  "0xcc50cDcd9Dab7A98926B1164Ae5bb59FceFB5AF9", 
  "0x6b9A0C57f1aBE412f1a6761A9FCD40cFD1BB2CC3" ];
export const FOUNDATION_SHARES: number[] = [500000, 500000];

export async function deployFoundationContract(payees: Address[], shares: number[]): Promise<Contract> {
  if (!(payees.length > 0 && shares.length > 0 && payees.length == shares.length)) {
    throw new Error("payees or shares is invalid. ");
  }
  const contractFactory = new TheFoundation__factory();
  const contract = await contractFactory.deploy(payees, shares);
  return await contract.deployed();
}

export async function deployTheDateContract(foundationContractAddress: Address): Promise<Contract> {
  const contractFactory = new TheDate__factory();
  const contract = await contractFactory.deploy(foundationContractAddress);
  return await contract.deployed();
}

export async function deployTheNoteContract(foundationContractAddress: Address): Promise<Contract> {
  const contractFactory = new TheNote__factory();
  const contract = await contractFactory.deploy(foundationContractAddress);
  return await contract.deployed();
}

export async function deployTheNotePOBContract(foundationContractAddress: Address, theNoteContractAddress: Address): Promise<Contract> {
  const contractFactory = new TheNoteProofOfBelief__factory();
  const contract = await contractFactory.deploy(foundationContractAddress, theNoteContractAddress);
  return await contract.deployed();
}

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const foundationContract = await deployFoundationContract(FOUNDATION_MEMBERS, FOUNDATION_SHARES);
  console.log("Foundation contract deployed to:", foundationContract.address);

  const theDateContract = await deployTheDateContract(foundationContract.address);
  console.log("TheDate contract deployed to:", theDateContract.address);
  
  const theNoteContract = await deployTheNoteContract(foundationContract.address);
  console.log("TheNote contract deployed to:", theNoteContract.address);

  const theNotePOBContract = await deployTheNotePOBContract(foundationContract.address, theNoteContract.address);
  console.log("TheNotePOB contract deployed to:", theNotePOBContract.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
