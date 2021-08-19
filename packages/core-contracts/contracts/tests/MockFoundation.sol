// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Foundation.sol";

contract MockFoundation is Foundation {
    constructor(address[] memory payees, uint256[] memory shares) Foundation(payees, shares) {}
}
