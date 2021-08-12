// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IWithFoundation.sol";

abstract contract MintedByFixedPrice is AccessControl, ReentrancyGuard, IWithFoundation {

    uint256 _fixedPrice;

    constructor(uint256 fixedPrice) {
        _fixedPrice = fixedPrice;
    }

    function setFixedPrice(uint256 fixedPrice) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _fixedPrice = fixedPrice;
    }

    function getFixedPrice() external view returns (uint256 fixedPrice) {
        return _fixedPrice;
    }

    modifier enoughFund {
        require(msg.value >= _fixedPrice,  "Should pay >= fixed price");
        _;
    }

    function _mintByFixedPrice(uint256 tokenId) internal nonReentrant enoughFund {
        _safeMint(msg.sender, tokenId);
        _getFoundationAddress().transfer(msg.value);
    }
    
    function _safeMint(address to, uint256 tokenId) internal virtual;

}