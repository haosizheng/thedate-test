import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { TheFoundation, TheFoundation__factory, TheSecret, TheSecret__factory } from "../typechain";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
//import * as snarkjs from "snarkjs";
//var snarkjs = require("snarkjs");
// @ts-ignore
import * as snarkjs from "snarkjs";

//import * as wasmsnark from "wasmsnark";
import * as path from "path";

//const snarkjs = require("snarkjs");

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

    // Load Circus
    //JSON.parse(fs.readFileSync("build/init.r1cs", "utf8"))
 
    //snarkjs.Circuit();

//    console.log(snarkjs.SnarkjsProof);
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

      let proofInput = { a: 3, b: 11 };
      const wasm = path.resolve("./build/init.wasm");
      const zkey = path.resolve("./build/init.zkey");
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(proofInput, wasm, zkey);
      console.log(snarkjs.groth16);
      console.log(snarkjs.zKey);

      snarkjs.groth16
      snarkjs.zKey 
      
      const verfication_key = await snarkjs.zKey.exportVerificationKey(zkey);
      expect(await snarkjs.groth16.verify(verfication_key, publicSignals, proof)).to.eq(true);
      console.log(publicSignals);
      console.log(snarkjs.groth16.exportSolidityCallData(proof, publicSignals));
     // snarkjs.zKey.exportSolidityVerifier()
      
//      snarkjs.groth16.fullProve(
        //snarkjs.groth16.fullProve

      // // Exception case that the bid is lower than fixed price
      // await expect(
      //   mainContract.connect(user1).payToMint(userNote, { value: ethers.utils.parseEther("0.01") }),
      // ).to.be.revertedWith("Should pay >= fixed price");

      // // The first bid is placed by User1
      // const noteId = ethers.constants.One;
      // await expect(mainContract.connect(user1).payToMint(userNote, { value: ethers.utils.parseEther("0.1") }))
      //   .emit(mainContract, "ArtworkMinted")
      //   .withArgs(noteId);

    });
  });
});
