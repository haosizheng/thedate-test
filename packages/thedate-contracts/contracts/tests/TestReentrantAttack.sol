// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { TheDate } from "../TheDate.sol";
import "hardhat/console.sol";

contract TestReentrantAttack {
    TheDate public immutable thedate;

    constructor(address payable thedate_) {
      thedate = TheDate(thedate_);
    }

    function deposit() public payable {
    }

    function startReentrantAttack() public {
        console.log("TestReentrantAttack startReentrantAttack");
        thedate.placeBid{ value: thedate.getCurrentMinimumBid()}();
        thedate.placeBid{ value: thedate.getCurrentMinimumBid()}();
    }

    receive() external payable {
        console.log("TestReentrantAttack receive %s", msg.value);
        thedate.placeBid{ value: thedate.getCurrentMinimumBid()}();
    }

    fallback() external payable {

    }
}
