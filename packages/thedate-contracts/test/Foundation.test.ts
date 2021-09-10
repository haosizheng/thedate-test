import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { Foundation, Foundation__factory, 
  MockERC20, MockERC20__factory, 
  MockERC165, MockERC165__factory, 
  MockWETH, MockWETH__factory,
  MockEmpty, MockEmpty__factory, 
  MockERC721, MockERC721__factory,
  MockERC1155, MockERC1155__factory } from "../typechain";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

type Address = string;
const expect = chai.expect;

chai.use(solidity);

context("Foundation contract", () => {
  let foundationContract: Foundation;
  let mockWETHContract: MockWETH;
  let mockEmptyContract: MockEmpty;
  let mockERC165Contract: MockERC165;
  let mockERC20Contract: MockERC20;
  let mockERC721Contract: MockERC721;
  let mockERC1155Contract: MockERC1155;

  let foundationUsers: SignerWithAddress[];
  let foundationMembers: Address[];
  let foundationShares: number[];
  let deployer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress;

  beforeEach(async () => {
    [deployer, user1, user2, user3, user4] = await ethers.getSigners();

    // Setup the foundation
    foundationUsers = [user1, user2];
    foundationMembers = [user1.address, user2.address];
    foundationShares = [70, 30];

    foundationContract = await (await new Foundation__factory(deployer)
      .deploy(foundationMembers, foundationShares)).deployed();

    // Setup Mock contracts and fund the test users
    mockWETHContract = await (await new MockWETH__factory(deployer).deploy()).deployed();
    mockEmptyContract = await (await new MockEmpty__factory(deployer).deploy()).deployed();
    mockERC20Contract = await (await new MockERC20__factory(deployer).deploy()).deployed();
    mockERC165Contract = await (await new MockERC165__factory(deployer).deploy()).deployed();
    mockERC721Contract = await (await new MockERC721__factory(deployer).deploy()).deployed();
    mockERC1155Contract = await (await new MockERC1155__factory(deployer).deploy()).deployed();

    await mockWETHContract.deposit({value: ethers.utils.parseEther("1")});

    await mockERC20Contract.transfer(user1.address, ethers.utils.parseEther("1"));
    await mockERC20Contract.transfer(user2.address, ethers.utils.parseEther("1"));
    await mockERC20Contract.transfer(user3.address, ethers.utils.parseEther("1"));
    await mockERC20Contract.transfer(user4.address, ethers.utils.parseEther("1"));

    await mockERC721Contract.mint(foundationContract.address, 1);
    await mockERC721Contract.mint(foundationContract.address, 2);
    await mockERC721Contract.mint(foundationContract.address, 3);
    await mockERC721Contract.mint(foundationContract.address, 4);

    await mockERC1155Contract.mint(foundationContract.address, 1, 1);
    await mockERC1155Contract.mint(foundationContract.address, 2, 1);
    await mockERC1155Contract.mint(foundationContract.address, 3, 1);
    await mockERC1155Contract.mint(foundationContract.address, 4, 1);
  });

  describe("Claim funds to non members", async () => {

    it("Claim funds to non members for ETH", async () => {
      await expect(foundationContract.release(user3.address))
        .to.be.revertedWith("PaymentSplitter: account has no shares");
    });

    it("Claim funds to non members for ERC20", async () => {
      await expect(foundationContract.releaseERC20(user4.address, mockERC20Contract.address))
        .to.be.revertedWith("Foundation: account has no shares");
    });

    it("Claim funds to non members for ERC721", async () => {
      await expect(foundationContract.releaseERC721(user4.address, mockERC721Contract.address, 0))
        .to.be.revertedWith("Foundation: account has no shares");
    });

    it("Claim funds to non members for ERC1155", async () => {
      await expect(foundationContract.releaseERC1155(user4.address, mockERC1155Contract.address, 1, 1))
        .to.be.revertedWith("Foundation: account has no shares");
    });
  });

  describe("Verify valid tokens", async () => {

    it("Exception case to release ERC20 for Empty Contract", async () => {      
      await expect(foundationContract.releaseERC20(foundationUsers[0].address, mockEmptyContract.address))
        .to.be.revertedWith("function selector was not recognized and there's no fallback function");
    });

    it("Exception case to release ERC721 for Empty Contract", async () => {      
      await expect(foundationContract.releaseERC721(foundationUsers[0].address, mockEmptyContract.address, 1))
        .to.be.revertedWith("Foundation: not a valid ERC721");      
    });

    it("Exception case to release ERC1155 for Empty Contract", async () => {      
      await expect(foundationContract.releaseERC1155(foundationUsers[0].address, mockEmptyContract.address, 1, 1))
        .to.be.revertedWith("Foundation: not a valid ERC1155");      
    });

    it("Exception case to release ERC20 for ERC165-only Contract ", async () => {      
      await expect(foundationContract.releaseERC20(foundationUsers[0].address, mockERC165Contract.address))
        .to.be.revertedWith("Foundation: not a valid ERC20");
    });

    it("Exception case to release ERC721 for ERC165-only Contract ", async () => {    
      await expect(foundationContract.releaseERC721(foundationUsers[0].address, mockERC165Contract.address, 1))
        .to.be.revertedWith("Foundation: not a valid ERC721");      
    });

    it("Exception case to release ERC1155 for ERC165-only Contract ", async () => {    
      await expect(foundationContract.releaseERC1155(foundationUsers[0].address, mockERC165Contract.address, 1, 1))
        .to.be.revertedWith("Foundation: not a valid ERC1155");      
    });

    it("Release ERC20 for WETH (ERC20 but no ERC165) ", async () => {
      const amount = ethers.utils.parseEther("1");
      const portion = amount.mul(foundationShares[0]).div(100);
      await mockWETHContract.deposit({value: amount})
      await expect(() => mockWETHContract.transfer(foundationContract.address, amount))
        .to.changeTokenBalance(mockWETHContract, foundationContract, amount);

      await expect(foundationContract.releaseERC20(foundationUsers[0].address, mockWETHContract.address))
        .to.emit(mockWETHContract, "Transfer").withArgs(foundationContract.address, foundationUsers[0].address, portion)
        .to.emit(foundationContract, "ERC20PaymentReleased").withArgs(foundationUsers[0].address, 
          portion, mockWETHContract.address);
    });
  });

  describe("NFT transfers correctly", async () => {

    it("No tokenId to release for ERC721. ", async () => {
      const tokenId = 101;
      await expect(foundationContract.releaseERC721(foundationUsers[0].address, mockERC721Contract.address, tokenId))
        .to.be.revertedWith("ERC721: operator query for nonexistent token");
    });

    it("Not enough amount of tokenId to release for ERC1155. ", async () => {
      const tokenId = 101;

      expect(await mockERC1155Contract.balanceOf(foundationContract.address, tokenId)).to.eq(0);
      // No fund to release
      await expect(foundationContract.releaseERC1155(foundationUsers[0].address, mockERC1155Contract.address, tokenId, 1))
        .to.be.revertedWith("ERC1155: insufficient balance for transfer");
    });

    it("ERC721 transfers correctly", async () => {
      const tokenId = 100;

      await expect(mockERC721Contract.mint(foundationContract.address, tokenId))
        .to.emit(mockERC721Contract, "Transfer")
        .withArgs(ethers.constants.AddressZero, foundationContract.address, tokenId);

      expect(await mockERC721Contract.ownerOf(tokenId))
        .to.be.eq(foundationContract.address);

      await expect(foundationContract.releaseERC721(foundationUsers[0].address, mockERC721Contract.address, tokenId))
        .to.emit(mockERC721Contract, "Transfer")
        .withArgs(foundationContract.address, foundationUsers[0].address, tokenId)
        .to.emit(foundationContract, "ERC721PaymentReleased")
        .withArgs(foundationUsers[0].address, mockERC721Contract.address, tokenId);
    });

    it("ERC1155 transfers correctly", async () => {
      const tokenId = 100;

      await expect(mockERC1155Contract.mint(foundationContract.address, tokenId, 1))
        .to.emit(mockERC1155Contract, "TransferSingle")
        .withArgs(deployer.address, ethers.constants.AddressZero, foundationContract.address, tokenId, 1);

      await expect(foundationContract.releaseERC1155(foundationUsers[0].address, mockERC1155Contract.address, tokenId, 1))
        .to.emit(mockERC1155Contract, "TransferSingle")
        .withArgs(foundationContract.address, foundationContract.address, foundationUsers[0].address, tokenId, 1)
        .to.emit(foundationContract, "ERC1155PaymentReleased")
        .withArgs(foundationUsers[0].address, mockERC1155Contract.address, tokenId, 1);
    });
  });

  describe("Anyone can trigger the release", async () => {

    it("Anyone can release the funds for members for ETH.", async () => {
      const amount = ethers.utils.parseEther("1");
      const totalShares = foundationShares.reduce((sum, current) => sum + current, 0);
      const portionAmount = amount.mul(foundationShares[0]).div(totalShares);

      // Transfer fund to foundation.
      await expect(() => deployer.sendTransaction({ to: foundationContract.address, value: amount }))
        .to.changeEtherBalance(foundationContract, amount);

      // Release funds to foundationUsers[0] invoked by user3
      await expect(() => foundationContract.connect(user3).release(foundationUsers[0].address))
        .to.changeEtherBalance(foundationUsers[0], portionAmount);

      // Released
      expect(await foundationContract.released(foundationUsers[0].address))
        .to.eq(portionAmount);
    });

    it("Anyone can release the funds for members for ERC20.", async () => {
      const amount = ethers.utils.parseEther("1");
      const totalShares = foundationShares.reduce((sum, current) => sum + current, 0);
      const portionAmount = amount.mul(foundationShares[0]).div(totalShares);

      // Transfer fund to foundation.
      await expect(() => mockERC20Contract.transfer(foundationContract.address, amount))
        .to.changeTokenBalance(mockERC20Contract, foundationContract, amount);

      // Release funds to foundationUsers[0] invoked by user3
      await expect(() => foundationContract.connect(user3).releaseERC20(foundationUsers[0].address, mockERC20Contract.address))
        .to.changeTokenBalance(mockERC20Contract, foundationUsers[0], portionAmount);

      // Released
      expect(await foundationContract.releasedERC20(foundationUsers[0].address, mockERC20Contract.address))
        .to.eq(portionAmount);
    });

  });

  describe("Payment splits correctly", async () => {

    it("No fund to release for ETH. ", async () => {
      expect(await ethers.provider.getBalance(foundationContract.address))
        .to.eq(0);
      // No fund to release
      await expect(foundationContract.release(foundationUsers[0].address))
        .to.be.revertedWith("PaymentSplitter: account is not due payment");
    });

    it("No fund to release for ERC20. ", async () => {
      expect(await mockERC20Contract.balanceOf(foundationContract.address))
        .to.eq(0);
      // No fund to release
      await expect(foundationContract.releaseERC20(foundationUsers[0].address, mockERC20Contract.address))
        .to.be.revertedWith("Foundation: account is not due payment");
    });
    
    it("Should split ETH correctly", async () => {
      // Send some fund to foundation contract
      const amount = ethers.utils.parseEther("1");
      await expect(() => deployer.sendTransaction({ to: foundationContract.address, value: amount }))
        .to.changeEtherBalance(foundationContract, amount);

      // Release the funds to foundation members
      const totalShares = foundationShares.reduce((sum, current) => sum + current, 0);
      for (const i in foundationMembers) {
        const portionAmount = amount.mul(foundationShares[i]).div(totalShares);

        // Release
        await expect(() => foundationContract.release(foundationUsers[i].address))
          .to.changeEtherBalance(foundationUsers[i], portionAmount);

        // Check released
        expect(await foundationContract.released(foundationUsers[i].address))
          .to.eq(portionAmount);
      }

      // Check total released
      expect(await foundationContract.totalReleased())
        .to.eq(amount);
    });

    it("Should split ERC20 correctly", async () => {
      // Send some fund to foundation contract
      const amount = ethers.utils.parseEther("1");
      await expect(() => mockERC20Contract.transfer(foundationContract.address, amount))
        .to.changeTokenBalance(mockERC20Contract, foundationContract, amount);

      // Release the funds to foundation members
      const totalShares = foundationShares.reduce((sum, current) => sum + current, 0);
      for (const i in foundationMembers) {
        const portionAmount = amount.mul(foundationShares[i]).div(totalShares);

        // Release
        await expect(() => foundationContract.releaseERC20(foundationUsers[i].address, mockERC20Contract.address))
          .to.changeTokenBalance(mockERC20Contract, foundationUsers[i], portionAmount);

        // Check released
        expect(await foundationContract.releasedERC20(foundationUsers[i].address, mockERC20Contract.address))
          .to.eq(portionAmount);
      }

      // Check total released
      expect(await foundationContract.totalReleasedERC20(mockERC20Contract.address))
        .to.eq(amount);
    });

    it("Waterfall the payment recursively", async () => {
      const foundationMembers2 = [foundationContract.address, user3.address, user4.address];
      const foundationShares2 = [50, 25, 25];
      const totalShares2 = foundationShares2.reduce((sum, current) => sum + current, 0);
      const foundationContract2 = await (await new Foundation__factory(deployer)
        .deploy(foundationMembers2, foundationShares2)).deployed();

      const amount = ethers.utils.parseEther("1");
      await expect(() => deployer.sendTransaction({ to: foundationContract2.address, value: amount }))
        .to.changeEtherBalance(foundationContract2, amount);

      const portionAmountOfContract = amount.mul(foundationShares2[0]).div(totalShares2);
      await expect(() => foundationContract2.release(foundationContract.address))
        .to.changeEtherBalance(foundationContract, portionAmountOfContract);

      const portionAmountOfUser1 = portionAmountOfContract
        .mul(foundationShares[0]).div(foundationShares.reduce((sum, current) => sum + current, 0));
      await expect(() => foundationContract.release(user1.address))
        .to.changeEtherBalance(user1, portionAmountOfUser1);
    });
  });
});
