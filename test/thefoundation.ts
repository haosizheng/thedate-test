import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { TheFoundation, TheFoundation__factory, MockERC20, MockERC20__factory } from "../typechain";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

type Address = string;
const expect = chai.expect;

chai.use(solidity);

describe("TheFoundation Test", () => {
  let foundationContract: TheFoundation;
  let mockERC20Contract: MockERC20;

  let foundationUsers: SignerWithAddress[];
  let foundationMembers: Address[];
  let foundationShares: number[];
  let deployer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress;
  const SECONDS_IN_A_DAY = 86400;

  beforeEach(async () => {
    [deployer, user1, user2, user3, user4] = await ethers.getSigners();

    // Setup the foundation
    foundationUsers = [user1, user2];
    foundationMembers = [user1.address, user2.address];
    foundationShares = [30, 70];
    
    foundationContract = await (await (new TheFoundation__factory(deployer)).deploy(
      foundationMembers, foundationShares)).deployed();

    //Setup Mock ERC20 and fund the test users 
    mockERC20Contract = await (await (new MockERC20__factory(deployer)).deploy()).deployed();
    
    await mockERC20Contract.transfer(user1.address, ethers.utils.parseEther("1"));
    await mockERC20Contract.transfer(user2.address, ethers.utils.parseEther("1"));
    await mockERC20Contract.transfer(user3.address, ethers.utils.parseEther("1"));
    await mockERC20Contract.transfer(user4.address, ethers.utils.parseEther("1"));
  });

  describe("TheFoundation - Payment Splits", async () => {
    it("Claim funds to non members for ETH", async () => {
      await expect(foundationContract.release(user3.address))
        .to.be.revertedWith("PaymentSplitter: account has no shares");
    });

    it("Claim funds to non members for ERC20", async () => {
      await expect(foundationContract.releaseERC20(user4.address, mockERC20Contract.address))
        .to.be.revertedWith("Account has no shares");
    });

    it("No fund to release for ETH. ", async () => {
      expect(await ethers.provider.getBalance(foundationContract.address)).to.eq(0);
      // No fund to release
      await expect(foundationContract.release(foundationUsers[0].address))
        .to.be.revertedWith("PaymentSplitter: account is not due payment");
    });

    it("No fund to release for ERC20. ", async () => {
      expect(await mockERC20Contract.balanceOf(foundationContract.address)).to.eq(0);
      // No fund to release
      await expect(foundationContract.releaseERC20(foundationUsers[0].address, mockERC20Contract.address))
        .to.be.revertedWith("Account is not due payment");
    });

    it("Exception case to release for non-ERC20. ", async () => {
      expect(await mockERC20Contract.balanceOf(foundationContract.address)).to.eq(0);
      // No fund to release
      await expect(foundationContract.releaseERC20(foundationUsers[0].address, foundationContract.address))
        .to.be.revertedWith("function selector was not recognized and there's no fallback function");
    });

    it("Anyone can release the funds for members for ETH.", async () => {
      const amount = ethers.utils.parseEther("1");
      const totalShares = foundationShares.reduce((sum, current) => sum + current, 0);
      const portionAmount = amount.mul(foundationShares[0]).div(totalShares);

      // Transfer fund to foundation.
      await expect(() => deployer.sendTransaction({to: foundationContract.address, value: amount}))
        .to.changeEtherBalance(foundationContract, amount);

      // Release funds to foundationUsers[0] invoked by user3
      await expect(() => foundationContract.connect(user3).release(foundationUsers[0].address))
        .to.changeEtherBalance(foundationUsers[0], portionAmount);
      
      // Released
      expect(await foundationContract.released(foundationUsers[0].address)).to.eq(portionAmount);
    });

    it("Anyone can release the funds for members for ERC20.", async () => {
      const amount = ethers.utils.parseEther("1");
      const totalShares = foundationShares.reduce((sum, current) => sum + current, 0);
      const portionAmount = amount.mul(foundationShares[0]).div(totalShares);

      // Transfer fund to foundation.
      await expect(() => mockERC20Contract.transfer(foundationContract.address, amount))
        .to.changeTokenBalance(mockERC20Contract, foundationContract, amount);

      // Release funds to foundationUsers[0] invoked by user3
      await expect(() => foundationContract.connect(user3)
        .releaseERC20(foundationUsers[0].address, mockERC20Contract.address))
        .to.changeTokenBalance(mockERC20Contract, foundationUsers[0], portionAmount);

      // Released
      expect(await foundationContract.releasedERC20(foundationUsers[0].address, mockERC20Contract.address))
        .to.eq(portionAmount);
    });

    it("Waterfall the payment recursively", async () => {
      const foundationMembers2 = [foundationContract.address, user3.address, user4.address];
      const foundationShares2 = [50, 25, 25];
      const totalShares2 = foundationShares2.reduce((sum, current) => sum + current, 0);
      const foundationContract2 = await (await (new TheFoundation__factory(deployer)).deploy(
        foundationMembers2, foundationShares2)).deployed();
      
      const amount = ethers.utils.parseEther("1");
      await expect(() => deployer.sendTransaction({to: foundationContract2.address, value: amount}))
        .to.changeEtherBalance(foundationContract2, amount);

      const portionAmountOfContract = amount.mul(foundationShares2[0]).div(totalShares2);
      await expect(() => foundationContract2.release(foundationContract.address))
        .to.changeEtherBalance(foundationContract, portionAmountOfContract);
      
      const portionAmountOfUser1 = portionAmountOfContract
        .mul(foundationShares[0]).div(foundationShares.reduce((sum, current) => sum + current, 0));
      await expect(() => foundationContract.release(user1.address))
        .to.changeEtherBalance(user1, portionAmountOfUser1);
    });

    it("Self-loop", async () => {
      // ? possible? 
    });

    it("Should splits Ethers correctly", async () => {
      // Send some fund to foundation contract 
      const amount = ethers.utils.parseEther("1");
      await expect(() => deployer.sendTransaction({to: foundationContract.address, value: amount}))
        .to.changeEtherBalance(foundationContract, amount);

      // Release the funds to foundation members
      const totalShares = foundationShares.reduce((sum, current) => sum + current, 0);
      for (let i in foundationMembers) {
        const portionAmount = amount.mul(foundationShares[i]).div(totalShares);

        // Release
        await expect(() => foundationContract.release(foundationUsers[i].address))
          .to.changeEtherBalance(foundationUsers[i], portionAmount);

        // Check released
        expect(await foundationContract.released(foundationUsers[i].address)).to.eq(portionAmount);
      }

      // Check total released
      expect(await foundationContract.totalReleased()).eq(amount);
    });

    it("Should splits MockERC20 correctly", async () => {
      // Send some fund to foundation contract 
      const amount = ethers.utils.parseEther("1");
      await expect(() => mockERC20Contract.transfer(foundationContract.address, amount))
        .to.changeTokenBalance(mockERC20Contract, foundationContract, amount);
  
      // Release the funds to foundation members
      const totalShares = foundationShares.reduce((sum, current) => sum + current, 0);
      for (let i in foundationMembers){
        const portionAmount = amount.mul(foundationShares[i]).div(totalShares);

        // Release
        await expect(() => foundationContract.releaseERC20(foundationUsers[i].address, mockERC20Contract.address))
          .to.changeTokenBalance(mockERC20Contract, foundationUsers[i], portionAmount);

        // Check released 
        expect(await foundationContract.releasedERC20(foundationUsers[i].address, mockERC20Contract.address))
          .to.eq(portionAmount);
      }

      // Check total released
      expect(await foundationContract.totalReleasedERC20(mockERC20Contract.address)).to.eq(amount);
    });
  });
});
