import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { TheFoundation__factory, TheFoundation, TheDate__factory, TheDate } from "../typechain";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "@ethersproject/bignumber";

type Address = string;
const expect = chai.expect;

chai.use(solidity);

context("TheDate contract", () => {
  let foundationContract: TheFoundation;
  let mainContract: TheDate;

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
    mainContract = (await (
      await new TheDate__factory(deployer).deploy(foundationContract.address)
    ).deployed()) as TheDate;
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

  describe("Parameters", async () => {
    it("noteSizeLimit", async () => {
      expect(await mainContract.getEngravingPrice()).to.eq(ethers.constants.Zero);
      expect(await mainContract.getErasingPrice()).to.eq(ethers.utils.parseEther("1.0"));
      expect(await mainContract.getNoteSizeLimit()).to.eq(BigNumber.from(100));

      await mainContract.setEngravingPrice(ethers.utils.parseEther("2.0"));
      await mainContract.setErasingPrice(ethers.utils.parseEther("1.0"));
      await mainContract.setNoteSizeLimit(120);

      expect(await mainContract.getEngravingPrice()).to.eq(ethers.utils.parseEther("2.0"));
      expect(await mainContract.getErasingPrice()).to.eq(ethers.utils.parseEther("1.0"));
      expect(await mainContract.getNoteSizeLimit()).to.eq(BigNumber.from(120));
    });
  });

  describe("Artwork", async () => {
    it("Set Token URL", async () => {
      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);

      await expect(mainContract.connect(user1).placeBid(tokenId, { value: ethers.utils.parseEther("1.0") }))
        .emit(mainContract, "ArtworkMinted")
        .withArgs(tokenId)
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId, user1.address, ethers.utils.parseEther("1.0"));

      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);

      expect(mainContract.tokenURI(1)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");

      expect(await mainContract.tokenURI(tokenId)).to.eq("https://thedate.art/api/token/" + tokenId.toString());

      await mainContract.setBaseURI("https://www.thedate.art/api/token/");

      expect(await mainContract.tokenURI(tokenId)).to.eq("https://www.thedate.art/api/token/" + tokenId.toString());
    });

    it("Engrave and erase the note", async () => {
      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);
      const userNote = "I love you.";

      expect(await mainContract.getEngravingPrice()).to.eq(ethers.constants.Zero);
      expect(await mainContract.getErasingPrice()).to.eq(ethers.utils.parseEther("1.0"));
      expect(await mainContract.getNoteSizeLimit()).to.eq(BigNumber.from(100));

      const engravingPrice = await mainContract.getEngravingPrice();
      const erasingPrice = await mainContract.getErasingPrice();

      await mainContract.setAuctionReservePrice(ethers.utils.parseEther("0.1"));
      await mainContract.setAuctionMinBidIncrementPermyriad(5000); //50%
      await expect(mainContract.connect(user1).placeBid(tokenId, { value: ethers.utils.parseEther("0.1") }))
        .emit(mainContract, "ArtworkMinted")
        .withArgs(tokenId);

      // Exception case that set the message before auction ends.
      await expect(mainContract.connect(user1).engraveArtworkNote(tokenId, userNote, 
        {value: engravingPrice})).to.be.revertedWith(
        "Caller should be the owner of the artwork.",
      );

      // 1 more day passed
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);

      // User 1 wins the auction
      await expect(mainContract.connect(user1).endAuction(tokenId))
        .emit(mainContract, "Transfer")
        .withArgs(mainContract.address, user1.address, tokenId);

      // Exception case that user 2 sets the note of his artwork.
      await expect(mainContract.connect(user2).engraveArtworkNote(tokenId, userNote, {value: engravingPrice})).to.be.revertedWith(
        "Caller should be the owner of the artwork.",
      );

      // User 1 sets the note of his artwork.
      await expect(
        mainContract.connect(user1).engraveArtworkNote(tokenId, userNote, { value: ethers.utils.parseEther("0.001") }),
      )
        .emit(mainContract, "ArtworkNoteEngraved")
        .withArgs(tokenId, user1.address, userNote);
      expect(await mainContract.artworks(tokenId)).has.property("note", userNote);

      // Exception case that user 1 engraves his artwork's note twice.
      await expect(
        mainContract.connect(user1).engraveArtworkNote(tokenId, userNote, { value: ethers.utils.parseEther("0.001") }),
      ).to.be.revertedWith("Note should be empty before engraving");

      // Exception case that user 2 erase the note of user1's artwork.
      await expect(mainContract.connect(user2).eraseArtworkNote(tokenId, {value: erasingPrice})).to.be.revertedWith(
        "Caller should be the owner of the artwork.",
      );

      // Exception case that user 1 erases the note of his artwork with no fund.
      await expect(mainContract.connect(user1).eraseArtworkNote(tokenId, {value: ethers.utils.parseEther("0.001")})).to.be.revertedWith(
        "Should pay >= erasingPrice",
      );

      // User 1 erases the note of his artwork.
      await expect(mainContract.connect(user1).eraseArtworkNote(tokenId, { value: erasingPrice}))
        .emit(mainContract, "ArtworkNoteErased")
        .withArgs(tokenId, user1.address);
      expect(await mainContract.artworks(tokenId)).has.property("note", "");

      // Exception case that user 1 erases his artwork's note twice.
      await expect(
        mainContract.connect(user1).eraseArtworkNote(tokenId, { value: erasingPrice }),
      ).to.be.revertedWith("Note should be nonempty before erasing");
    });
  });

  // describe("TheDate - Appearance", async () => {

  //   it("Apperance with large script", async () => {
  //     const randomCode = [...Array(5000)].map(() => "1").join();
  //     console.log(randomCode.length);
  //     const gasUsed = (await (await mainContract.addNewApperance("{}", randomCode)).wait()).gasUsed;
  //     expect(gasUsed).lte(12500000); //block gas limit

  //     console.log(gasUsed.toString());
  //     console.log(ethers.utils.formatUnits(gasUsed.mul(ethers.utils.parseUnits("20", "gwei")), "ether").toString());
  //   });

  //   it("Default apperance", async () => {
  //     const randomCode = "abc";
  //     await expect(mainContract.addNewApperance("{}", randomCode))
  //       .emit(mainContract, "ApperanceAdded").withArgs(1);

  //     await expect(mainContract.updateApperance(1, "{changed}", randomCode))
  //       .emit(mainContract, "ApperanceUpdated").withArgs(1);

  //     //Exception case that defaultApperance is unlocked.
  //     await expect(mainContract.setDefaultApperanceId(1))
  //       .to.be.revertedWith("apperances[apperanceId] should be locked.");

  //     // Lock it
  //     await expect(mainContract.lockApperance(1))
  //       .emit(mainContract, "ApperanceLocked").withArgs(1);

  //     await expect(mainContract.setDefaultApperanceId(1))
  //       .emit(mainContract, "DefaultApperanceChanged").withArgs(1);
  //     expect(await mainContract.defaultApperanceId()).to.eq(1);

  //     // Unlock it
  //     expect(await mainContract.unlockApperance(1))
  //       .emit(mainContract, "ApperanceUnlocked").withArgs(1);

  //     expect((await mainContract.apperances(1)).metadata).to.eq("{changed}");
  //     expect((await mainContract.apperances(1)).script).to.eq(randomCode);
  //   });
  // });

  describe("MintedByAuction", async () => {
    it("Bid too early", async () => {
      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);

      await expect(
        mainContract.connect(user1).placeBid(tokenId.add(1), { value: ethers.utils.parseEther("0.5") }),
      ).to.be.revertedWith("Auction is not started.");
    });

    it("Bid too late", async () => {
      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);

      await expect(
        mainContract.connect(user1).placeBid(tokenId.sub(1), { value: ethers.utils.parseEther("0.5") }),
      ).to.be.revertedWith("Auction is ended.");
    });

    it("SetAuctionReservePrice", async () => {
      await mainContract.setAuctionReservePrice(ethers.utils.parseEther("0.1"));
      expect(await mainContract.connect(user2).getAuctionReservePrice()).to.eq(ethers.utils.parseEther("0.1"));
      await expect(
        mainContract.connect(user1).setAuctionReservePrice(ethers.utils.parseEther("0.1")),
      ).to.be.revertedWith("AccessControl: account");
    });

    it("SetAuctionMinBidIncrementPermyriad", async () => {
      await mainContract.setAuctionMinBidIncrementPermyriad(500); //5%
      expect(await mainContract.connect(user2).getAuctionMinBidIncrementPermyriad()).to.eq(500);
      await expect(mainContract.connect(user1).setAuctionMinBidIncrementPermyriad(1000)).to.be.revertedWith(
        "AccessControl: account",
      );
    });

    it("No bid is placed.", async () => {
      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);

      await expect(mainContract.connect(user1).endAuction(tokenId.sub(1))).to.be.revertedWith(
        "There should be at least a bid for the date.",
      );
    });

    it("Place Bid", async () => {
      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);
      await mainContract.setAuctionReservePrice(ethers.utils.parseEther("0.1"));
      await mainContract.setAuctionMinBidIncrementPermyriad(5000); //50%

      const bid_satisfy_fn = (
        x: [string, BigNumber] & { bidder: string; amount: BigNumber },
        bidder: string,
        amount: BigNumber,
      ) => ethers.utils.getAddress(x.bidder) === ethers.utils.getAddress(bidder) && x.amount.eq(amount);

      // Exception case that the bid is lower than reserve price
      await expect(
        mainContract.connect(user1).placeBid(tokenId, { value: ethers.utils.parseEther("0.01") }),
      ).to.be.revertedWith("Must send more than reservePrice.");

      // Check the highest bid
      expect((await mainContract.getHighestBid(tokenId)).bidder).to.eq(ethers.constants.AddressZero);
      expect((await mainContract.getHighestBid(tokenId)).amount).to.satisfy((x: BigNumber) =>
        x.eq(ethers.constants.Zero),
      );

      // The first bid is placed by User1
      await expect(mainContract.connect(user1).placeBid(tokenId, { value: ethers.utils.parseEther("0.1") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId, user1.address, ethers.utils.parseEther("0.1"))
        .emit(mainContract, "ArtworkMinted")
        .withArgs(tokenId);

      // Check the highest bid
      expect((await mainContract.getHighestBid(tokenId)).bidder).to.eq(user1.address);
      expect((await mainContract.getHighestBid(tokenId)).amount).to.satisfy((x: BigNumber) =>
        x.eq(ethers.utils.parseEther("0.1")),
      );

      // Exception case that the bid is not higher than highest bid
      await expect(
        mainContract.connect(user1).placeBid(tokenId, { value: ethers.utils.parseEther("0.1") }),
      ).to.be.revertedWith("Must send more than the highest bid.");
      // Exception case that the increased bid is not higher than auctionMinBidIncrementPermyriad
      await expect(
        mainContract.connect(user1).placeBid(tokenId, { value: ethers.utils.parseEther("0.11") }),
      ).to.be.revertedWith("Must send over the last bid by minBidIncrement permyriad.");

      // The second bid is placed by User1
      await expect(mainContract.connect(user1).placeBid(tokenId, { value: ethers.utils.parseEther("0.15") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId, user1.address, ethers.utils.parseEther("0.15"));

      // The third bid is placed by User2
      await expect(mainContract.connect(user2).placeBid(tokenId, { value: ethers.utils.parseEther("0.25") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId, user2.address, ethers.utils.parseEther("0.25"));

      // Check the highest bid
      expect((await mainContract.getHighestBid(tokenId)).bidder).to.eq(user2.address);
      expect((await mainContract.getHighestBid(tokenId)).amount).to.satisfy((x: BigNumber) =>
        x.eq(ethers.utils.parseEther("0.25")),
      );

      // User1 withdrawed fund.
      expect(await mainContract.getPendingReturns(user1.address)).to.eq(ethers.utils.parseEther("0.25"));
      await expect(() => mainContract.connect(user1).withdrawFund()).changeEtherBalance(
        user1,
        ethers.utils.parseEther("0.25"),
      );

      expect(await mainContract.getPendingReturns(user1.address)).to.eq(ethers.utils.parseEther("0"));

      // The fourth bid is placed by User 3
      await expect(mainContract.connect(user3).placeBid(tokenId, { value: ethers.utils.parseEther("0.5") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId, user3.address, ethers.utils.parseEther("0.5"));
      // Check user2's refund.
      expect(await mainContract.getPendingReturns(user2.address)).to.eq(ethers.utils.parseEther("0.25"));

      // The fifth bid is placed by User1
      await expect(mainContract.connect(user1).placeBid(tokenId, { value: ethers.utils.parseEther("0.75") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId, user1.address, ethers.utils.parseEther("0.75"));
      // Exception case that User1 withdraw with no refund.
      await expect(mainContract.connect(user1).withdrawFund()).to.be.revertedWith("No pending returns.");

      // The sixth bid is placed by User1
      await expect(mainContract.connect(user1).placeBid(tokenId, { value: ethers.utils.parseEther("1.5") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId, user1.address, ethers.utils.parseEther("1.5"));
      // Check user1 and user3's refund.
      expect(await mainContract.getPendingReturns(user1.address)).to.eq(ethers.utils.parseEther("0.75"));
      expect(await mainContract.getPendingReturns(user2.address)).to.eq(ethers.utils.parseEther("0.25"));
      expect(await mainContract.getPendingReturns(user3.address)).to.eq(ethers.utils.parseEther("0.5"));

      // Exception case endAuction before the day ends.
      await expect(mainContract.connect(user1).endAuction(tokenId)).to.be.revertedWith("Auction not yet ended.");

      // 1 day passed
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);

      // Exception case that place bid after auction ends
      await expect(
        mainContract.connect(user3).placeBid(tokenId, { value: ethers.utils.parseEther("2") }),
      ).to.be.revertedWith("Auction is ended.");

      // Place bid for the next date by User 3
      await expect(mainContract.connect(user3).placeBid(tokenId.add(1), { value: ethers.utils.parseEther("0.1") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId.add(1), user3.address, ethers.utils.parseEther("0.1"));

      // Place bid for the next date by User 2
      await expect(mainContract.connect(user2).placeBid(tokenId.add(1), { value: ethers.utils.parseEther("0.2") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId.add(1), user2.address, ethers.utils.parseEther("0.2"));

      expect(await mainContract.getPendingReturns(user1.address)).to.eq(ethers.utils.parseEther("0.75"));
      expect(await mainContract.getPendingReturns(user2.address)).to.eq(ethers.utils.parseEther("0.25"));
      expect(await mainContract.getPendingReturns(user3.address)).to.eq(ethers.utils.parseEther("0.6"));

      // Withdraw funds by User 3.
      await expect(mainContract.connect(user3).withdrawFund())
        .emit(mainContract, "FundWithdrew")
        .withArgs(user3.address, ethers.utils.parseEther("0.6"));

      // Claim the token for winner user1
      expect(await mainContract.ownerOf(tokenId)).to.eq(mainContract.address);
      await expect(() => mainContract.connect(user1).endAuction(tokenId)).changeEtherBalance(
        foundationContract,
        ethers.utils.parseEther("1.5"),
      );
      expect(await mainContract.ownerOf(tokenId)).to.eq(user1.address);

      // Reclaim the token for winner user1
      await expect(mainContract.connect(user1).endAuction(tokenId)).to.be.revertedWith(
        "Should not reclaim the auction.",
      );

      // 1 more day passed
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);

      // Exception case that User1 will claim the item where User2 is the winner.
      await expect(mainContract.connect(user1).endAuction(tokenId.add(1))).to.be.revertedWith(
        "Only winner or admin can claim the item.",
      );

      // Admin will end the auction.
      expect(await mainContract.ownerOf(tokenId.add(1))).to.eq(mainContract.address);
      await expect(mainContract.connect(deployer).endAuction(tokenId.add(1)))
        .emit(mainContract, "AuctionEnded")
        .withArgs(tokenId.add(1), user2.address, ethers.utils.parseEther("0.2"))
        .emit(mainContract, "Transfer")
        .withArgs(mainContract.address, user2.address, tokenId.add(1));
      expect(await mainContract.ownerOf(tokenId.add(1))).to.eq(user2.address);

      // Withdraw funds by User 1.
      await expect(mainContract.connect(user1).withdrawFund())
        .emit(mainContract, "FundWithdrew")
        .withArgs(user1.address, ethers.utils.parseEther("0.75"));
      // Withdraw funds by User 2.
      await expect(mainContract.connect(user2).withdrawFund())
        .emit(mainContract, "FundWithdrew")
        .withArgs(user2.address, ethers.utils.parseEther("0.25"));
    });
  });
});
