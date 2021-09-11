import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { Foundation, Foundation__factory, 
  MockWETH, MockWETH__factory,
  MockERC721, MockERC721__factory,
  Superpower, Superpower__factory } from "../typechain";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "@ethersproject/bignumber";

type Address = string;
const expect = chai.expect;

chai.use(solidity);

context("TheDate contract", () => {
  let foundationContract: Foundation;
  let mainContract: Superpower;

  let foundationMembers: Address[];
  let foundationShares: number[];
  let deployer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  before(async () => {
    [deployer, user1, user2] = await ethers.getSigners();

    // Setup the foundation
    foundationMembers = [user1.address, user2.address];
    foundationShares = [70, 30];

    foundationContract = await (await new Foundation__factory(deployer).deploy(foundationMembers, foundationShares)).deployed();
  });
  
  beforeEach(async () => {
    // Deploy the main contract
    mainContract = await (await new Superpower__factory(deployer)
      .deploy(foundationContract.address)).deployed();
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
    it("generateSVGImage, generateMetadata, tokenURI", async () => {
      const tokenId = 1;
      const tokenDescription = await mainContract.tokenDescription();

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
        .to.eq(`{"name": "Superpower Set #1", "description": "${tokenDescription}", "image": "data:image/svg+xml;base64,${encodedSVGImage}"}`);
      const encodedMetadata = Buffer.from(metadata, 'binary').toString('base64');
      expect(await mainContract.connect(user1).tokenURI(tokenId))
        .to.eq(`data:application/json;base64,${encodedMetadata}`);
    });

    it("setTokenDescription", async () => {
      expect(await mainContract.tokenDescription()).to.eq("The Superpower is a metadata-based NFT art experiment. " +
        "Feel free to use the Superpower in any way you want.");
      
      await mainContract.connect(deployer).setTokenDescription("I love Superpower!");
      await expect(mainContract.connect(user1).setTokenDescription("I love Superpower!!"))
        .to.be.revertedWith(`AccessControl: account`);
      expect(await mainContract.tokenDescription()).to.eq("I love Superpower!");
    });

    it("setSVGImageTemplate", async () => {
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
      await expect(mainContract.connect(user1).setSVGImageTemplate(["<svg></svg>"]))
        .to.be.revertedWith(`AccessControl: account`);
      
      // Set 
      await mainContract.connect(deployer).setSVGImageTemplate(["<svg></svg>"]);
      expect(await mainContract.generateSVGImage(1)).to.eq("<svg></svg>");
    });
  });

  describe("Claiming", async () => {
    it("Claiming at a cost", async () => {
      await expect(mainContract.connect(user1).claim(0, {value: await mainContract.getCurrentClaimingPrice()}))
        .to.emit(mainContract, "Transfer").withArgs(ethers.constants.AddressZero, user1.address, 0)
    });
  });
});
