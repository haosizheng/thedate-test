import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { Foundation, Foundation__factory, 
  MockWETH, MockWETH__factory,
  MockERC721, MockERC721__factory,
  TheDate, TheDate__factory, ERC721 } from "../typechain";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "@ethersproject/bignumber";

type Address = string;
const expect = chai.expect;

chai.use(solidity);

context("TheDate contract", () => {
  let foundationContract: Foundation;
  let mainContract: TheDate;
  let mockWETHContract: MockWETH;
  let mockLootContract: MockERC721;

  let foundationUsers: SignerWithAddress[];
  let foundationMembers: Address[];
  let foundationShares: number[];
  let deployer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress;
  let user5: SignerWithAddress;
  let user6: SignerWithAddress;

  const SECONDS_IN_A_DAY = 86400;

  before(async () => {
    [deployer, user1, user2, user3, user4, user5, user6] = await ethers.getSigners();

    // Setup the foundation
    foundationUsers = [user1, user2];
    foundationMembers = [user1.address, user2.address];
    foundationShares = [70, 30];

    foundationContract = await (await new Foundation__factory(deployer).deploy(foundationMembers, foundationShares)).deployed();
    mockWETHContract = await (await new MockWETH__factory(deployer).deploy()).deployed();
    mockLootContract = await (await new MockERC721__factory(deployer).deploy()).deployed();
    
    // User 5 and User 6 has Loot
    for (let i = 0; i < 10; i += 2) { 
      mockLootContract.mint(user5.address, i);
      mockLootContract.mint(user6.address, i + 1);
    }
  });
  
  beforeEach(async () => {
    // Deploy the main contract
    mainContract = await (await new TheDate__factory(deployer)
      .deploy(foundationContract.address, mockWETHContract.address, mockLootContract.address)).deployed();
  });

  describe("Royalty", async () => {
    it("Get/Set Royalty Bps", async () => {
      expect(await mainContract.royaltyBps()).to.eq(1000);
      await expect(mainContract.setRoyaltyBps(50000))
        .to.be.revertedWith("royaltyBps should be within [0, 10000].");
      await expect(mainContract.connect(user1).setRoyaltyBps(500))
        .to.be.revertedWith("AccessControl: account");
    });
      
    it("Royalty splits correctly", async () => {
      await mainContract.setRoyaltyBps(5000);
      const [receiver, royaltyAmount] = await mainContract.royaltyInfo(
        ethers.constants.Zero,
        ethers.utils.parseEther("1"),
      );
      expect(receiver).to.eq(foundationContract.address);
      expect(royaltyAmount).to.eq(ethers.utils.parseEther("0.5"));
    });
  });

  describe("Metadata functions", async () => {
    it("Check getDate from Token 0", async () => {
      const testCase = [0, 10, 1000, 2000, 18500, 40000, 100000, 1000000, 2000000, 10000000];
      const getFormattedDate = (date: Date) => {
        const year = date.getFullYear();
        const month = (1 + date.getMonth()).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
      
        return year + '-' + month + '-' + day;
      }
      for (const i of testCase) {
        const currentDate: string = getFormattedDate(new Date(i * SECONDS_IN_A_DAY * 1000));
        expect(await mainContract.getDate(i)).to.be.eq(currentDate);
      }
    });

    it.only("Engrave and erase the note", async () => {
      const tokenId = 0;
      const userNote = "I love you.";
      const userNoteLong = "I love you. Long Long Long ...";
      const userNoteUnicode = "哈哈哈哈哈哈";
      const userNoteUnicodeLong = "哈哈哈哈哈哈哈";

      expect(await mainContract.engravingPrice()).to.eq(ethers.utils.parseEther("0.01"));
      expect(await mainContract.erasingPrice()).to.eq(ethers.utils.parseEther("0.1"));
      expect(await mainContract.noteSizeLimit()).to.eq(BigNumber.from(100));
      await mainContract.connect(deployer).setNoteSizeLimit(20);

      const engravingPrice = await mainContract.engravingPrice();
      const erasingPrice = await mainContract.erasingPrice();

      await expect(mainContract.connect(user1).claim(tokenId, {value: await mainContract.claimingPrice()}))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(tokenId, user1.address);

      // Exception case that set the message before auction ends.
      await expect(mainContract.connect(user2).engraveNote(tokenId, userNote, {value: engravingPrice}))
        .to.be.revertedWith("Caller should be the owner of the artwork.");

      // Exception case that longer user note
      await expect(mainContract.connect(user1).engraveNote(tokenId, userNoteLong, {value: engravingPrice}))
        .to.be.revertedWith("Note should be shorter than noteSizeLimit.");

      // Exception case that without enough funds.
      await expect(mainContract.connect(user1).engraveNote(tokenId, userNote))
        .to.be.revertedWith("Should pay >= engravingPrice.");

      // User 1 sets the note of his artwork.
      await expect(mainContract.connect(user1).engraveNote(tokenId, userNote, { value: engravingPrice }))
        .to.emit(mainContract, "NoteEngraved").withArgs(tokenId, user1.address, userNote);

      //        .to.changeEtherBalance(foundationContract.address, engravingPrice);
      expect(await mainContract.getNote(tokenId)).to.eq(userNote);

      // Exception case that user 1 engraves his artwork's note twice.
      await expect(mainContract.connect(user1).engraveNote(tokenId, userNote, { value: engravingPrice }))
        .to.be.revertedWith("Note should be empty before engraving");

      // Exception case that user 2 erase the note of user1's artwork.
      await expect(mainContract.connect(user2).eraseNote(tokenId, {value: erasingPrice}))
        .to.be.revertedWith("Caller should be the owner of the artwork");

      // Exception case that user 1 erases the note of his artwork with no fund.
      await expect(mainContract.connect(user1).eraseNote(tokenId, {value: ethers.utils.parseEther("0.001")}))
        .to.be.revertedWith("Should pay >= erasingPrice");

      // User 1 erases the note of his artwork.
      await expect(mainContract.connect(user1).eraseNote(tokenId, { value: erasingPrice}))
        .to.emit(mainContract, "NoteErased").withArgs(tokenId, user1.address);
      expect(await mainContract.getNote(tokenId)).to.be.eq("");

      // Exception case that user 1 erases his artwork's note twice.
      await expect(mainContract.connect(user1).eraseNote(tokenId, { value: erasingPrice }))
        .to.be.revertedWith("Note should be nonempty before erasing");
      
      // Unicode
      await expect(mainContract.connect(user1).engraveNote(tokenId, userNoteUnicode, { value: engravingPrice }))
        .to.emit(mainContract, "NoteEngraved").withArgs(tokenId, user1.address, userNoteUnicode);

      await expect(() => mainContract.connect(user1).eraseNote(tokenId, { value: erasingPrice }))
        .to.changeEtherBalance(foundationContract.address, erasingPrice);
    });

    // it("generateSVGImage", async () => {

    // });
  });

  describe("Claiming", async () => {
    it("Claiming at a cost", async () => {
      // Users claims at a cost
      await expect(mainContract.connect(user1).claim(0)).to.be.revertedWith("Should pay >= claiming price or own a Loot NFT.");
      await expect(mainContract.connect(user1).claim(0, {value: await mainContract.claimingPrice()}))
        .to.emit(mainContract, "Transfer").withArgs(ethers.constants.AddressZero, user1.address, 1)
        .to.emit(mainContract, "ArtworkClaimed").withArgs(0, user1.address);

      // Loot holder claims for free
      await expect(mainContract.connect(user5).claim(1))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(1, user5.address);

      // Admin claims for free
      await expect(mainContract.connect(deployer).claim(2))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(2, deployer.address);

      // Claims for next available 
      await expect(mainContract.connect(deployer).claimNextAvailable())
        .to.emit(mainContract, "ArtworkClaimed").withArgs(3, deployer.address);
    });

    it("Claiming next available", async () => {
      // Users claims at a cost
      await expect(mainContract.connect(deployer).claimNextAvailable())
        .to.emit(mainContract, "ArtworkClaimed").withArgs(0, deployer.address);
      await expect(mainContract.connect(deployer).claimNextAvailable())
        .to.emit(mainContract, "ArtworkClaimed").withArgs(1, deployer.address);
      await expect(mainContract.connect(deployer).claim(1))
        .to.revertedWith("tokenId should not be claimed.");
      await expect(mainContract.connect(deployer).claim(2))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(2, deployer.address);
      await expect(mainContract.connect(deployer).claimNextAvailable())
        .to.emit(mainContract, "ArtworkClaimed").withArgs(3, deployer.address);
    });

    it("Airdrop", async () => {
      // Loot holder claims for free
      await expect(mainContract.connect(user1).claim(1)).to.be.revertedWith("Should pay >= claiming price or own a Loot NFT");
      await expect(mainContract.connect(user1).claim(1, {value: await mainContract.claimingPrice()}))
        .to.emit(mainContract, "Transfer").withArgs(ethers.constants.AddressZero, user1.address, 1)
        .to.emit(mainContract, "ArtworkClaimed").withArgs(1, user1.address);

      // Loot holder claims for free
      await expect(mainContract.connect(user5).claim(2))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(2, user5.address);

      // Admin claims for free
      await expect(mainContract.connect(deployer).claim(3))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(3, deployer.address);
    });
  });

  describe("Parameters", async () => {
    it("DAO controlled parameters", async () => {
      expect(mainContract.grantRole(await mainContract.DAO_ROLE(), user5.address))
        .emit(mainContract, "RoleGranted").withArgs(await mainContract.DAO_ROLE(), deployer.address, user5.address);

      expect(await mainContract.claimingPrice()).to.eq(ethers.utils.parseEther("0.01"));
      expect(await mainContract.reservePrice()).to.eq(ethers.utils.parseEther("0.01"));
      expect(await mainContract.minBidIncrementBps()).to.eq(BigNumber.from(1000));
      expect(await mainContract.engravingPrice()).to.eq(ethers.utils.parseEther("0.01"));
      expect(await mainContract.erasingPrice()).to.eq(ethers.utils.parseEther("0.1"));
      expect(await mainContract.noteSizeLimit()).to.eq(BigNumber.from(100));

      await mainContract.connect(user5).setClaimingPrice(ethers.utils.parseEther("2.0"));
      await mainContract.connect(user5).setAuctionReservePrice(ethers.utils.parseEther("1.0"));
      await mainContract.connect(user5).setAuctionMinBidIncrementBps(2000);
      await mainContract.connect(user5).setEngravingPrice(ethers.utils.parseEther("2.0"));
      await mainContract.connect(user5).setErasingPrice(ethers.utils.parseEther("1.0"));
      await mainContract.connect(user5).setNoteSizeLimit(120);

      expect(await mainContract.claimingPrice()).to.eq(ethers.utils.parseEther("2.0"));
      expect(await mainContract.reservePrice()).to.eq(ethers.utils.parseEther("1.0"));
      expect(await mainContract.minBidIncrementBps()).to.eq(BigNumber.from(2000));
      expect(await mainContract.engravingPrice()).to.eq(ethers.utils.parseEther("0.01"));
      expect(await mainContract.erasingPrice()).to.eq(ethers.utils.parseEther("0.1"));
      expect(await mainContract.noteSizeLimit()).to.eq(BigNumber.from(120));
    });
  });

  describe("Artwork", async () => {
    it("Existence", async () => {
      expect(await mainContract.connect(user1).exists(1)).to.eq(false);

      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);

      await expect(mainContract.connect(user1).placeBid({ value: ethers.utils.parseEther("1.0") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId, user1.address, ethers.utils.parseEther("1.0"));

      expect(await mainContract.connect(user1).exists(tokenId)).to.eq(false);

      await expect(mainContract.connect(user1).placeBid({ value: ethers.utils.parseEther("1.0") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId, user1.address, ethers.utils.parseEther("1.0"));
    });
  });

  describe("Auction", async () => {
    it("SetAuctionReservePrice", async () => {
      await mainContract.setAuctionReservePrice(ethers.utils.parseEther("0.1"));
      expect(await mainContract.connect(user2).reservePrice()).to.eq(ethers.utils.parseEther("0.1"));
      await expect(
        mainContract.connect(user1).setAuctionReservePrice(ethers.utils.parseEther("0.1")),
      ).to.be.revertedWith("AccessControl: account");
    });

    it("SetAuctionMinBidIncrementBps", async () => {
      await mainContract.setAuctionMinBidIncrementBps(500); //5%
      expect(await mainContract.connect(user2).minBidIncrementBps()).to.eq(500);
      await expect(mainContract.connect(user1).setAuctionMinBidIncrementBps(1000)).to.be.revertedWith(
        "AccessControl: account",
      );
    });

    it("No bid is placed.", async () => {
      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);

      expect(mainContract.connect(user1).settleLastAuction());
    });

    it("Place Bid", async () => {
      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);

      await mainContract.setAuctionReservePrice(ethers.utils.parseEther("0.1"));
      await mainContract.setAuctionMinBidIncrementBps(5000); //50%

      // Exception case that the bid is lower than reserve price
      await expect(
        mainContract.connect(user1).placeBid({ value: ethers.utils.parseEther("0.01") }),
      ).to.be.revertedWith("Must send more than reservePrice.");

      // Check the highest bid
      expect((await mainContract.getHighestBid(tokenId)).bidder).to.eq(ethers.constants.AddressZero);
      expect((await mainContract.getHighestBid(tokenId)).amount).to.eq(ethers.constants.Zero);

      // The first bid is placed by User1
      await expect(mainContract.connect(user1).placeBid({ value: ethers.utils.parseEther("0.1") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId, user1.address, ethers.utils.parseEther("0.1"))

      // Check the highest bid
      expect((await mainContract.getHighestBid(tokenId)).bidder).to.eq(user1.address);
      expect((await mainContract.getHighestBid(tokenId)).amount).to.eq(ethers.utils.parseEther("0.1"));

      // Exception case that the bid is not higher than highest bid
      await expect(
        mainContract.connect(user1).placeBid({ value: ethers.utils.parseEther("0.1") }),
      ).to.be.revertedWith("Must send more than the highest bid.");

      // Exception case that the increased bid is not higher than auctionMinBidIncrementBps
      await expect(
        mainContract.connect(user1).placeBid({ value: ethers.utils.parseEther("0.11") }),
      ).to.be.revertedWith("Must send over the last bid by minBidIncrement permyriad.");

      // The second bid is placed by User1
      expect(async () => 
        await expect(mainContract.connect(user1).placeBid({ value: ethers.utils.parseEther("0.15") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId, user1.address, ethers.utils.parseEther("0.15")))
        .changeEtherBalance(
          user1,
          ethers.utils.parseEther("0.1"),
        );

      // The third bid is placed by User2
      expect(async () => await expect(mainContract.connect(user2).placeBid({ value: ethers.utils.parseEther("0.25") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId, user2.address, ethers.utils.parseEther("0.25")))
        .changeEtherBalance(
          user1,
          ethers.utils.parseEther("0.15"),
        );

      // Check the highest bid
      expect((await mainContract.getHighestBid(tokenId)).bidder).to.eq(user2.address);
      expect((await mainContract.getHighestBid(tokenId)).amount).to.eq(ethers.utils.parseEther("0.25"));

      // The fourth bid is placed by User 3
      await expect(mainContract.connect(user3).placeBid({ value: ethers.utils.parseEther("0.5") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId, user3.address, ethers.utils.parseEther("0.5"));

      // 1 day passed
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);
      
      // The first bid for day 2 with auto auction settled for day 1
      await expect(mainContract.connect(user2).placeBid({ value: ethers.utils.parseEther("0.3") }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId.add(1), user2.address, ethers.utils.parseEther("0.3"))
        .emit(mainContract, "AuctionSettled")
        .withArgs(tokenId, user2.address, ethers.utils.parseEther("0.25"));

      // Manually auction settlement before auction ends.
      await expect(() => mainContract.connect(user2).settleLastAuction())
          .changeEtherBalance(foundationContract.address, 0);
        
      // 1 more day passed
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);

      // Manually auction settlement after auction ends.
      await expect(async () => await expect(mainContract.connect(user2).settleLastAuction())
        .emit(mainContract, "AuctionSettled")
        .withArgs(tokenId.add(1), user2.address, ethers.utils.parseEther("0.3")))
        .changeEtherBalance(foundationContract.address, ethers.utils.parseEther("0.3"));
    });
  });
});
