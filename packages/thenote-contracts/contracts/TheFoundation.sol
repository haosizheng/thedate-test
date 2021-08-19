// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thefoundation/core-contracts/contracts/Foundation.sol";

contract TheFoundation is Foundation {
    constructor(address[] memory payees, uint256[] memory shares) Foundation(payees, shares) {}
}
