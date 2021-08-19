import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { TheFoundation, TheFoundation__factory, TheSecret, TheSecret__factory } from "../typechain";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

type Address = string;
const expect = chai.expect;

chai.use(solidity);

context("TheSecret", () => {
  let foundationContract: TheFoundation;
  let mainContract: TheSecret;

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
    foundationContract = await (
      await new TheFoundation__factory(deployer).deploy(foundationMembers, foundationShares)
    ).deployed();

    // Deploy the main contract
    mainContract = await (await new TheSecret__factory(deployer).deploy(foundationContract.address)).deployed();
  });

  describe("WithRoyalty", async () => {
    it("Royalty", async () => {
      expect(await mainContract.getRoyaltyPermyriad()).to.eq(1000);
      await expect(mainContract.setRoyaltyPermyriad(50000)).to.be.revertedWith(
        "royaltyPermyriad should be within [0, 10000].",
      );
      await mainContract.setRoyaltyPermyriad(5000);
      const [receiver, royaltyAmount] = await mainContract.royaltyInfo(
        ethers.constants.Zero,
        ethers.utils.parseEther("1"),
      );
      expect(receiver).to.eq(foundationContract.address);
      expect(royaltyAmount).to.eq(ethers.utils.parseEther("0.5"));
    });
  });

  describe("MintedByFixedPrice", async () => {
    it("PayToMint", async () => {
      await mainContract.setFixedPrice(ethers.utils.parseEther("0.1"));
      const userNote = "I love you.";

      // Exception case that the bid is lower than fixed price
      await expect(
        mainContract.connect(user1).payToMint(userNote, { value: ethers.utils.parseEther("0.01") }),
      ).to.be.revertedWith("Should pay >= fixed price");

      // The first bid is placed by User1
      const noteId = ethers.constants.One;
      await expect(mainContract.connect(user1).payToMint(userNote, { value: ethers.utils.parseEther("0.1") }))
        .emit(mainContract, "ArtworkMinted")
        .withArgs(noteId);

      // Exception case that the bid is lower than fixed price of pob
      await expect(
        pobContract.connect(user1).payToMint(noteId, { value: ethers.utils.parseEther("0.001") }),
      ).to.be.revertedWith("Should pay >= fixed price");

      // The first pob
      const pobId1 = ethers.constants.WeiPerEther.add(ethers.constants.One);
      await expect(pobContract.connect(user1).payToMint(noteId, { value: ethers.utils.parseEther("0.01") }))
        .to.emit(pobContract, "Transfer")
        .withArgs(ethers.constants.AddressZero, user1.address, pobId1);
      const [noteId1, rank1] = await pobContract.pobs(pobId1);
      expect(noteId1).to.eq(noteId);
      expect(rank1).to.eq(ethers.constants.One);
      expect(await pobContract.ownerOf(pobId1)).to.eq(user1.address);

      // // The second pob
      const pobId2 = ethers.constants.WeiPerEther.add(ethers.constants.Two);
      await expect(pobContract.connect(user2).payToMint(noteId, { value: ethers.utils.parseEther("0.01") }))
        .to.emit(pobContract, "Transfer")
        .withArgs(ethers.constants.AddressZero, user2.address, pobId2);
      const [noteId2, rank2] = await pobContract.pobs(pobId2);
      expect(noteId2).to.eq(noteId);
      expect(rank2).to.eq(ethers.constants.Two);
      expect(await pobContract.ownerOf(pobId2)).to.eq(user2.address);

      expect(await pobContract.numberOfPobs(noteId)).to.eq(2);
      expect(await pobContract.pobIdsByNoteId(noteId, 0)).to.eq(pobId1);
      expect(await pobContract.pobIdsByNoteId(noteId, 1)).to.eq(pobId2);
    });
  });
});
