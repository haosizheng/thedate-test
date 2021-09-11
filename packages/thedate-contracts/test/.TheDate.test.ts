import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { Foundation, Foundation__factory, 
  MockWETH, MockWETH__factory,
  MockERC721, MockERC721__factory,
  TestReentrantAttack, TestReentrantAttack__factory,
  TheDate, TheDate__factory } from "../typechain";
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
  let testReentrantAttackContract: TestReentrantAttack;

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
  let daoRole: string;

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
  
    mockLootContract.mint(user5.address, 0);
    mockLootContract.mint(user6.address, 1);
  });
  
  beforeEach(async () => {
    // Deploy the main contract
    mainContract = await (await new TheDate__factory(deployer)
      .deploy(foundationContract.address, mockWETHContract.address)).deployed();

    testReentrantAttackContract = await (await new TestReentrantAttack__factory(deployer)
      .deploy(mainContract.address)).deployed();
    await testReentrantAttackContract.deposit({value: ethers.utils.parseEther("100.0")});

    daoRole = await mainContract.DAO_ROLE();
    // Grant user5 to be a DAO members
    await expect(mainContract.grantRole(daoRole, user5.address))
      .to.emit(mainContract, "RoleGranted").withArgs(daoRole, user5.address, deployer.address);

  });

  describe("Royalty", async () => {
    it("Get/Set Royalty Bps", async () => {
      expect(await mainContract.royaltyBps()).to.eq(1000);
      await expect(mainContract.setRoyaltyBps(50000))
        .to.be.revertedWith("royaltyBps should be within [0, 10000]");
      await expect(mainContract.connect(user1).setRoyaltyBps(500))
        .to.be.revertedWith(`AccessControl: account ${user1.address.toLowerCase()} is missing role ${await mainContract.DEFAULT_ADMIN_ROLE()}`);
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

    it("Engrave and erase the note", async () => {
      const tokenId = 0;
      const userNote = "I love you.";
      const userNoteLong = "I love you. Long Long Long ...";
      const userNoteUnicode = "哈哈哈哈哈哈";
      const userNoteUnicodeLong = "哈哈哈哈哈哈哈";

      const previousBalance = await ethers.provider.getBalance(foundationContract.address);

      // Set Note Size to 20
      await mainContract.connect(deployer).setNoteSizeLimit(20);

      const engravingPrice = await mainContract.engravingPrice();
      const erasingPrice = await mainContract.erasingPrice();
      const claimingPrice = await mainContract.getCur();

      await expect(mainContract.connect(user1).claim(tokenId, {value: claimingPrice}))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(tokenId, user1.address);

      // Exception case that set the message before auction ends.
      await expect(mainContract.connect(user2).engraveNote(tokenId, userNote, {value: engravingPrice}))
        .to.be.revertedWith("Caller should be the owner of the artwork");

      // Exception case that longer user note
      await expect(mainContract.connect(user1).engraveNote(tokenId, userNoteLong, {value: engravingPrice}))
        .to.be.revertedWith("Note should be shorter than noteSizeLimit");

      // Exception case that without enough funds.
      await expect(mainContract.connect(user1).engraveNote(tokenId, userNote))
        .to.be.revertedWith("Should pay >= engravingPrice");

      // User 1 sets the note of his artwork.
      await expect(mainContract.connect(user1).engraveNote(tokenId, userNote, { value: engravingPrice }))
        .to.emit(mainContract, "NoteEngraved").withArgs(tokenId, user1.address, userNote);

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
      
      // Exception case that user1 engraves too long note with unicode
      await expect(mainContract.connect(user1).engraveNote(tokenId, userNoteUnicodeLong, { value: engravingPrice }))
        .to.be.revertedWith("Note should be shorter than noteSizeLimit");

      // User1 engraves note with unicode
      await expect(mainContract.connect(user1).engraveNote(tokenId, userNoteUnicode, { value: engravingPrice }))
        .to.emit(mainContract, "NoteEngraved").withArgs(tokenId, user1.address, userNoteUnicode);

      const latestBalance = await ethers.provider.getBalance(foundationContract.address);
      expect(latestBalance).eq(previousBalance.add(engravingPrice.mul(2).add(erasingPrice).add(claimingPrice)));
    });

    it("generateSVGImage, generateMetadata, tokenURI", async () => {
      const tokenId = 0;
      const userNote = "I love you.";
      const tokenDescription = await mainContract.tokenDescription();
      const engravingPrice = await mainContract.engravingPrice();

      await expect(mainContract.connect(user1).generateMetadata(tokenId))
        .to.be.revertedWith("tokenId is non-existent");

      await expect(mainContract.connect(user1).claim(tokenId, {value: await mainContract.claimingPrice()}))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(tokenId, user1.address);

      await expect(mainContract.connect(user1).engraveNote(tokenId, userNote, { value: engravingPrice }))
        .to.emit(mainContract, "NoteEngraved").withArgs(tokenId, user1.address, userNote);
    
      const svgImage = await mainContract.connect(user1).generateSVGImage(tokenId);
      expect(svgImage).to.eq(
        '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 500 500">' +
        '<rect width="100%" height="100%" fill="black" />' +
        '<text x="50%" y="50%" fontSize="50px" fill="white" fontFamily="monospace" dominantBaseline="middle" textAnchor="middle">' +
        '1970-01-01' +
        '</text><text x="50%" y="90%" fontSize="10px" fill="white" fontFamily="monospace" dominantBaseline="middle" textAnchor="middle">' +
        'I love you.' + 
        '</text></svg>'
      );
      const encodedSVGImage = Buffer.from(svgImage, 'binary').toString('base64');

      const metadata = await mainContract.connect(user1).generateMetadata(tokenId);
      expect(metadata)
        .to.eq(`{"name": "The Date #0: 1970-01-01", "description": "${tokenDescription}", "image": "data:image/svg+xml;base64,${encodedSVGImage}"}`);
      const encodedMetadata = Buffer.from(metadata, 'binary').toString('base64');
      expect(await mainContract.connect(user1).tokenURI(tokenId))
        .to.eq(`data:application/json;base64,${encodedMetadata}`);
    });

    it("setTokenDescription", async () => {
      expect(await mainContract.tokenDescription()).to.eq("The Date is a metadata-based NFT art experiment about time and blockchain. " +
        "Each fleeting day would be imprinted into an NFT artwork on blockchain immutably. " +
        "Optionally, the owner can engrave or erase a note on the artwork as an additional metadata. " +
        "Feel free to use the Date in any way you want.");
      
      await mainContract.connect(deployer).setTokenDescription("I love the Date!");
      await expect(mainContract.connect(user5).setTokenDescription("I love the Date!!"))
        .to.be.revertedWith(`AccessControl: account`);
      await expect(mainContract.connect(user6).setTokenDescription("I love the Date!!!"))
        .to.be.revertedWith(`AccessControl: account`);
      expect(await mainContract.tokenDescription()).to.eq("I love the Date!");
    });

    it("setSVGImageTemplate", async () => {
      // Claim 0
      await expect(mainContract.connect(user1).claim(0, {value: await mainContract.claimingPrice()}))
        .to.emit(mainContract, "Transfer").withArgs(ethers.constants.AddressZero, user1.address, 0)
        .to.emit(mainContract, "ArtworkClaimed").withArgs(0, user1.address);
      
      // Check if SVG looks correctly
      expect(await mainContract.svgImageTemplate(0)).to.eq(
        '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 500 500">' +
        '<rect width="100%" height="100%" fill="black" />' +
        '<text x="50%" y="50%" fontSize="50px" fill="white" fontFamily="monospace" dominantBaseline="middle" textAnchor="middle">');
      expect(await mainContract.svgImageTemplate(1)).to.eq('{{date}}');
      expect(await mainContract.svgImageTemplate(2)).to.eq('</text><text x="50%" y="90%" fontSize="10px" fill="white" fontFamily="monospace" dominantBaseline="middle" textAnchor="middle">');
      expect(await mainContract.svgImageTemplate(3)).to.eq('{{note}}');
      expect(await mainContract.svgImageTemplate(4)).to.eq('</text></svg>');
      
      // No permission
      await expect(mainContract.connect(user5).setSVGImageTemplate(["<svg></svg>"]))
        .to.be.revertedWith(`AccessControl: account`);
      await expect(mainContract.connect(user6).setSVGImageTemplate(["<svg></svg>"]))
        .to.be.revertedWith(`AccessControl: account`);
      
      // Set 
      await mainContract.connect(deployer).setSVGImageTemplate(["<svg></svg>"]);
      expect(await mainContract.generateSVGImage(0)).to.eq("<svg></svg>");

      // Set wrong templates
      await mainContract.connect(deployer).setSVGImageTemplate(["<svg>{{date}}</svg>"]);
      expect(await mainContract.generateSVGImage(0)).to.eq("<svg>{{date}}</svg>");    

      // Set correct templates
      await mainContract.connect(deployer).setSVGImageTemplate(["<svg>", "{{date}}", "</svg>"]);
      expect(await mainContract.generateSVGImage(0)).to.eq("<svg>1970-01-01</svg>");
    });
  });

  describe("Claiming", async () => {
    it("Claiming at a cost", async () => {
      // Users claims at a cost
      await expect(mainContract.connect(user1).claim(0))
        .to.be.revertedWith("Should pay >= claiming price or own a Loot NFT");
      await expect(mainContract.connect(user1).claim(0, {value: await mainContract.claimingPrice()}))
        .to.emit(mainContract, "Transfer").withArgs(ethers.constants.AddressZero, user1.address, 0)
        .to.emit(mainContract, "ArtworkClaimed").withArgs(0, user1.address);

      // Loot holder claims for free
      await expect(mainContract.connect(user5).claim(1))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(1, user5.address);

      // Admin claims for free
      await expect(mainContract.connect(deployer).claim(2))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(2, deployer.address);
      
      await expect(mainContract.connect(user5).claim(2))
        .to.be.revertedWith("tokenId should not be claimed");
    });

    it("Claiming after airdropping", async () => {
      const amount = await mainContract.claimingPrice();

      await expect(mainContract.connect(deployer).airdrop([user1.address, user2.address, user3.address], [1, 3, 5]))
        .to.emit(mainContract, "ArtworkAirdropped").withArgs(1, user1.address)
        .to.emit(mainContract, "ArtworkAirdropped").withArgs(3, user2.address)
        .to.emit(mainContract, "ArtworkAirdropped").withArgs(5, user3.address);
        
      const previousBalance = await ethers.provider.getBalance(foundationContract.address);
      await expect(mainContract.connect(user1).claim(0, {value: amount}))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(0, user1.address);

      // Loot user
      await expect(mainContract.connect(user5).claim(2))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(2, user5.address);
    
      await expect(mainContract.connect(user1).claim(4, {value: amount}))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(4, user1.address);

      const latestBalance = await ethers.provider.getBalance(foundationContract.address);
      expect(latestBalance).eq(previousBalance.add(amount.mul(2)));
    });

    it("Claiming an auctioned or future one", async () => {
      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);

      // Claim a today's token
      await expect(mainContract.connect(deployer).claim(tokenId))
        .to.be.revertedWith("Only past tokenId is claimable");

      // Claim a future token
      await expect(mainContract.connect(deployer).claim(tokenId.add(1)))
        .to.be.revertedWith("Only past tokenId is claimable");

      // Place bid on today.
      const amount = await mainContract.getCurrentMinimumBid();
      await expect(mainContract.connect(user1).placeBid({value: amount}))
        .to.emit(mainContract, "BidPlaced").withArgs(tokenId, user1.address, amount);

      // To Day 2
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);
      
      // Claim day 1 on day 2
      await expect(mainContract.connect(deployer).claim(tokenId))
        .to.be.revertedWith("tokenId should not be auctioned");

      // To Day 3
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);

      // Claim Day 2 on day 3
      await expect(mainContract.connect(deployer).claim(tokenId.add(1)))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(tokenId.add(1), deployer.address)
        .to.emit(mainContract, "Transfer").withArgs(ethers.constants.AddressZero, deployer.address, tokenId.add(1))
        .to.emit(mainContract, "AuctionSettled").withArgs(tokenId, user1.address, amount)
        .to.emit(mainContract, "Transfer").withArgs(ethers.constants.AddressZero, user1.address, tokenId)

      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);
    });
  });
  
  describe("Airdrop", async () => {
    it("Airdrop with no permission issues", async () => {
      await expect(mainContract.connect(user1).airdrop([user1.address, user2.address], [1, 2]))
        .to.be.revertedWith(`AccessControl: account ${user1.address.toLowerCase()} is missing role ${await mainContract.DEFAULT_ADMIN_ROLE()}`);
    });

    it("Airdrop without issues", async () => {
      // Airdrop without issues
      await expect(mainContract.connect(deployer).airdrop([user1.address, user2.address, user3.address], [1, 2, 3]))
        .to.emit(mainContract, "Transfer").withArgs(ethers.constants.AddressZero, user1.address, 1)
        .to.emit(mainContract, "ArtworkAirdropped").withArgs(1, user1.address)
        .to.emit(mainContract, "Transfer").withArgs(ethers.constants.AddressZero, user2.address, 2)
        .to.emit(mainContract, "ArtworkAirdropped").withArgs(2, user2.address)
        .to.emit(mainContract, "Transfer").withArgs(ethers.constants.AddressZero, user3.address, 3)
        .to.emit(mainContract, "ArtworkAirdropped").withArgs(3, user3.address);
    });

    it("Airdrop an claimed one", async () => {
      await expect(mainContract.connect(deployer).claim(1))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(1, deployer.address);
      await expect(mainContract.connect(deployer).airdrop([user1.address, user2.address], [1, 2]))
        .to.be.revertedWith("tokenId should not be claimed");
    });

    it("Airdrop duplicated ones", async () => {
      await expect(mainContract.connect(deployer).airdrop([user1.address, user2.address], [1, 1]))
        .to.be.revertedWith("tokenId should not be claimed");
    });

    it("Airdrop a lot at once", async () => {
      const addresses = [...Array(100)].map(_ => user1.address);
      const tokenIds = [...Array(100)].map((_,i) => i + 1);

      await expect(mainContract.connect(deployer).airdrop(addresses, tokenIds))
        .to.emit(mainContract, "ArtworkAirdropped").withArgs(1, user1.address)
        .to.emit(mainContract, "ArtworkAirdropped").withArgs(100, user1.address);
    });

    it("Airdrop an auctioned one and settle the auctioned one", async () => {
      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);

      // Place Bid
      const amount = await mainContract.getCurrentMinimumBid();
      await expect(mainContract.connect(user1).placeBid({value: amount}))
        .to.emit(mainContract, "BidPlaced").withArgs(tokenId, user1.address, amount);

      await expect(mainContract.connect(deployer).airdrop([user1.address], [tokenId]))
        .to.be.revertedWith("Only past tokenId is claimable");

      // Pass 1 day
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);

      // Airdrop an auctioned one
      await expect(mainContract.connect(deployer).airdrop([user1.address], [tokenId]))
        .to.be.revertedWith("tokenId should not be auctioned");
      
      // Place Bid will settle the last bid
      await expect(mainContract.connect(user1).placeBid({value: amount}))
        .to.emit(mainContract, "BidPlaced").withArgs(tokenId.add(1), user1.address, amount)
        .to.emit(mainContract, "AuctionSettled").withArgs(tokenId, user1.address, amount)
        .to.emit(mainContract, "Transfer").withArgs(ethers.constants.AddressZero, user1.address, tokenId);
      
      // Pass 1 more day
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);

      // Airdrop will settle the last bid
      await expect(mainContract.connect(deployer).airdrop([user1.address], [0]))
        .to.emit(mainContract, "ArtworkAirdropped").withArgs(0, user1.address)
        .to.emit(mainContract, "AuctionSettled").withArgs(tokenId.add(1), user1.address, amount)
        .to.emit(mainContract, "Transfer").withArgs(ethers.constants.AddressZero, user1.address, tokenId.add(1));
    });
  });

  describe("DAO controlled parameters", async () => {
    it("setClaimingPrice", async () => {

     expect(await mainContract.claimingPrice()).to.eq(ethers.utils.parseEther("0.1"));
     await expect(mainContract.connect(deployer).setClaimingPrice(ethers.utils.parseEther("3.0")))
       .to.emit(mainContract, "ClaimingPriceChanged").withArgs(ethers.utils.parseEther("3.0"));
     await expect(mainContract.connect(user5).setClaimingPrice(ethers.utils.parseEther("2.0")))
       .to.emit(mainContract, "ClaimingPriceChanged").withArgs(ethers.utils.parseEther("2.0"));
     await expect(mainContract.connect(user6).setClaimingPrice(ethers.utils.parseEther("5.0")))
       .to.be.revertedWith(`AccessControl: account ${user6.address.toLowerCase()} is missing role ${daoRole}`);
     expect(await mainContract.claimingPrice()).to.eq(ethers.utils.parseEther("2.0"));
    });

    it("setAuctionReservePrice", async () => {
      expect(await mainContract.reservePrice()).to.eq(ethers.utils.parseEther("0.1"));
      await expect(mainContract.connect(deployer).setAuctionReservePrice(ethers.utils.parseEther("1.0")))
        .to.emit(mainContract, "AuctionReservePriceChanged").withArgs(ethers.utils.parseEther("1.0"));
      await expect(mainContract.connect(user5).setAuctionReservePrice(ethers.utils.parseEther("2.0")))
        .to.emit(mainContract, "AuctionReservePriceChanged").withArgs(ethers.utils.parseEther("2.0"));
      await expect(mainContract.connect(user6).setAuctionReservePrice(ethers.utils.parseEther("5.0")))
        .to.be.revertedWith(`AccessControl: account ${user6.address.toLowerCase()} is missing role ${daoRole}`);
      expect(await mainContract.reservePrice()).to.eq(ethers.utils.parseEther("2.0"));
    });

    it("setAuctionMinBidIncrementBps", async () => {
      expect(await mainContract.minBidIncrementBps()).to.eq(BigNumber.from(1000));
      await expect(mainContract.connect(deployer).setAuctionMinBidIncrementBps(2000))
        .to.emit(mainContract, "AuctionMinBidIncrementBpsChanged").withArgs(2000);
      await expect(mainContract.connect(user5).setAuctionMinBidIncrementBps(3000))
        .to.emit(mainContract, "AuctionMinBidIncrementBpsChanged").withArgs(3000);
      await expect(mainContract.connect(user6).setAuctionMinBidIncrementBps(5000))
        .to.be.revertedWith(`AccessControl: account ${user6.address.toLowerCase()} is missing role ${daoRole}`);
      expect(await mainContract.minBidIncrementBps()).to.eq(BigNumber.from(3000));
    });
    
    it("setEngravingPrice", async () => {
      expect(await mainContract.engravingPrice()).to.eq(ethers.utils.parseEther("0.01"));
      await expect(mainContract.connect(deployer).setEngravingPrice(ethers.utils.parseEther("2.0")))
        .to.emit(mainContract, "EngravingPriceChanged").withArgs(ethers.utils.parseEther("2.0"));
      await expect(mainContract.connect(user5).setEngravingPrice(ethers.utils.parseEther("3.0")))
        .to.emit(mainContract, "EngravingPriceChanged").withArgs(ethers.utils.parseEther("3.0"));
      await expect(mainContract.connect(user6).setEngravingPrice(ethers.utils.parseEther("5.0")))
        .to.be.revertedWith(`AccessControl: account ${user6.address.toLowerCase()} is missing role ${daoRole}`);
      expect(await mainContract.engravingPrice()).to.eq(ethers.utils.parseEther("3.0"));
    });
    
    it("setErasingPrice", async () => {
      expect(await mainContract.erasingPrice()).to.eq(ethers.utils.parseEther("0.1"));
      await expect(mainContract.connect(deployer).setErasingPrice(ethers.utils.parseEther("1.0")))
        .to.emit(mainContract, "ErasingPriceChanged").withArgs(ethers.utils.parseEther("1.0"));
      await expect(mainContract.connect(user5).setErasingPrice(ethers.utils.parseEther("3.0")))
        .to.emit(mainContract, "ErasingPriceChanged").withArgs(ethers.utils.parseEther("3.0"));
      await expect(mainContract.connect(user6).setErasingPrice(ethers.utils.parseEther("5.0")))
        .to.be.revertedWith(`AccessControl: account ${user6.address.toLowerCase()} is missing role ${daoRole}`);
      expect(await mainContract.erasingPrice()).to.eq(ethers.utils.parseEther("3.0"));
    });
    
    it("setNoteSizeLimit", async () => {
      expect(await mainContract.noteSizeLimit()).to.eq(BigNumber.from(100));
      await expect(mainContract.connect(deployer).setNoteSizeLimit(120))
        .to.emit(mainContract, "NoteSizeLimitChanged").withArgs(120);
      await expect(mainContract.connect(user5).setNoteSizeLimit(200))
        .to.emit(mainContract, "NoteSizeLimitChanged").withArgs(200);
      await expect(mainContract.connect(user6).setNoteSizeLimit(100))
        .to.be.revertedWith(`AccessControl: account ${user6.address.toLowerCase()} is missing role ${daoRole}`);
      expect(await mainContract.noteSizeLimit()).to.eq(BigNumber.from(200));
    });
  });

  describe("Auction", async () => {
    it("Existence", async () => {
      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);

      expect(await mainContract.connect(user1).exists(tokenId)).to.eq(false);

      const amount = await mainContract.getCurrentMinimumBid();
      await expect(mainContract.connect(user1).placeBid({ value: amount}))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId, user1.address, amount);

      // TokenId does not exist even Auctioned
      expect(await mainContract.connect(user1).exists(tokenId)).to.eq(false);

      // Pass one day
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);

      // TokenId does not exist even next Day without Auctioned.
      expect(await mainContract.connect(user1).exists(tokenId)).to.eq(false);

      await expect(mainContract.connect(user1).placeBid({ value: amount }))
        .emit(mainContract, "BidPlaced")
        .withArgs(tokenId.add(1), user1.address, amount);

      // After settledLastAuction automatically. It exists.
      expect(await mainContract.connect(user1).exists(tokenId)).to.eq(true);
    });

    it("No bid is placed.", async () => {
      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);

      await mainContract.connect(user1).settleLastAuction();
      await mainContract.connect(user1).settleLastAuction();
      await mainContract.connect(user1).settleLastAuction();
      await mainContract.connect(user1).settleLastAuction();
      expect(await mainContract.connect(user1).exists(0)).to.eq(false);
      expect(await mainContract.connect(user1).exists(tokenId)).to.eq(false);
    });

    it("Test reentrant attack", async () => {
      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);

      const minBid = await mainContract.getCurrentMinimumBid();
      const minBidIncrementBps = await mainContract.minBidIncrementBps();
      const nextMidBid = minBid.mul(minBidIncrementBps.add(10000)).div(10000);

      await expect(testReentrantAttackContract.startReentrantAttack())
        .to.emit(mainContract, "BidPlaced").withArgs(tokenId, testReentrantAttackContract.address, minBid)
        .to.emit(mainContract, "BidPlaced").withArgs(tokenId, testReentrantAttackContract.address, nextMidBid);

      // The contract will wrap ETH into WETH to prevent the attack.
      expect(await mockWETHContract.balanceOf(testReentrantAttackContract.address)).to.eq(minBid);

      expect((await mainContract.getHighestBid(tokenId)).bidder).to.eq(testReentrantAttackContract.address);
      expect((await mainContract.getHighestBid(tokenId)).amount).to.eq(nextMidBid);

      // 1 day passed
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);
      
      expect(await mainContract.placeBid({value: minBid}))
        .to.emit(mainContract, "AuctionSettled").withArgs(tokenId, testReentrantAttackContract.address, nextMidBid)
        .to.emit(mainContract, "Transfer").withArgs(ethers.constants.AddressZero, testReentrantAttackContract.address, tokenId);
    });


    it("Place Bid", async () => {
      const tokenId = BigNumber.from(
        (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp,
      ).div(SECONDS_IN_A_DAY);

      const claimingPrice = await mainContract.claimingPrice();
      
      // == Day 1
      await mainContract.setAuctionReservePrice(ethers.utils.parseEther("0.1"));
      await mainContract.setAuctionMinBidIncrementBps(5000); //50%

      // Exception case that the bid is lower than reserve price
      await expect(mainContract.connect(user1).placeBid({ value: ethers.utils.parseEther("0.01") }))
        .to.be.revertedWith("Must send more than reservePrice");

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

      // Exception case that the increased bid is not higher than auctionMinBidIncrementBps
      await expect(mainContract.connect(user1).placeBid({ value: ethers.utils.parseEther("0.11") }))
        .to.be.revertedWith("Must send more than last bid by minBidIncrementBps");

      // The second bid is placed by User1 by directly send ether to the contract
      await expect(await user1.sendTransaction({ to: mainContract.address, value: ethers.utils.parseEther("0.15") }))
        .to.emit(mainContract, "BidPlaced").withArgs(tokenId, user1.address, ethers.utils.parseEther("0.15"))
        .to.changeEtherBalance(mainContract, ethers.utils.parseEther("0.15").sub(ethers.utils.parseEther("0.10")));
        
      // The third bid is placed by User2
      await expect(await mainContract.connect(user2).placeBid({ value: ethers.utils.parseEther("0.25") }))
        .to.emit(mainContract, "BidPlaced").withArgs(tokenId, user2.address, ethers.utils.parseEther("0.25"))
        .to.changeEtherBalance(user1, ethers.utils.parseEther("0.15"));

      // // Check the highest bid
      expect((await mainContract.getHighestBid(tokenId)).bidder).to.eq(user2.address);
      expect((await mainContract.getHighestBid(tokenId)).amount).to.eq(ethers.utils.parseEther("0.25"));

      // The fourth bid is placed by User 3
      expect(await mainContract.connect(user3).placeBid({ value: ethers.utils.parseEther("0.5") }))
        .to.emit(mainContract, "BidPlaced").withArgs(tokenId, user3.address, ethers.utils.parseEther("0.5"))
        .to.changeEtherBalance(user2, ethers.utils.parseEther("0.25"));

      expect((await mainContract.getHighestBid(tokenId)).bidder).to.eq(user3.address);

      // == Day 2
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);
      
      // The first bid for day 2 with auto auction settled for day 1
      expect(await mainContract.connect(user2).placeBid({ value: ethers.utils.parseEther("0.3") }))
        .to.emit(mainContract, "BidPlaced").withArgs(tokenId.add(1), user2.address, ethers.utils.parseEther("0.3"))
        .to.emit(mainContract, "AuctionSettled").withArgs(tokenId, user3.address, ethers.utils.parseEther("0.5"))
        .to.changeEtherBalance(foundationContract, ethers.utils.parseEther("0.5"));

      // Manually auction settlement before auction ends. But no auction has ended.
      await expect(() => mainContract.connect(user2).settleLastAuction())
          .to.changeEtherBalance(foundationContract, ethers.constants.Zero);
        
      expect((await mainContract.getHighestBid(tokenId.add(1))).bidder).to.eq(user2.address);
      // == Day 3
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);

      // Manually auction settlement after auction ends.
      await expect(await mainContract.connect(user2).settleLastAuction())
        .to.emit(mainContract, "AuctionSettled").withArgs(tokenId.add(1), user2.address, ethers.utils.parseEther("0.3"))
        .to.changeEtherBalance(foundationContract, ethers.utils.parseEther("0.3"));

      expect((await mainContract.getHighestBid(tokenId.add(2))).bidder).to.eq(ethers.constants.AddressZero);
      // No one bid today.

      // == Day 4
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);

      // The first bid for day 4
      expect(await mainContract.connect(user2).placeBid({ value: ethers.utils.parseEther("0.3") }))
        .to.emit(mainContract, "BidPlaced").withArgs(tokenId.add(3), user2.address, ethers.utils.parseEther("0.3"))
        .to.changeEtherBalance(mainContract, ethers.utils.parseEther("0.3"));

      // Claiming the missing day 3
      expect(await mainContract.connect(user2).claim(tokenId.add(2), { value: claimingPrice }))
        .to.emit(mainContract, "ArtworkClaimed").withArgs(tokenId.add(2), user2.address)
        .to.changeEtherBalance(foundationContract, claimingPrice);
        
      // Day 5
      await ethers.provider.send("evm_increaseTime", [SECONDS_IN_A_DAY]);

      // Claiming the missing day 4 but it's auctioned. It's reverted. So it does not triggers settleAuction.
      await expect(mainContract.connect(user2).claim(tokenId.add(3), { value: claimingPrice }))
        .to.be.revertedWith("tokenId should not be auctioned");

      // Place Bid to trigger settleAuction for Day 4
      expect(await mainContract.connect(user3).placeBid({ value: ethers.utils.parseEther("0.3") }))
        .to.emit(mainContract, "BidPlaced").withArgs(tokenId.add(4), user3.address, ethers.utils.parseEther("0.3"))
        .to.emit(mainContract, "AuctionSettled").withArgs(tokenId.add(3), user2.address, ethers.utils.parseEther("0.3"))
        .to.changeEtherBalance(foundationContract, ethers.utils.parseEther("0.3"));
    });
  });
});
