// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IWithFoundation.sol";

abstract contract MintedByAuction is AccessControl, ReentrancyGuard, ERC721Holder, IWithFoundation {
    constructor(uint256 reservePrice, uint256 minBidIncrementPermyriad) {
        _reservePrice = reservePrice;
        _minBidIncrementPermyriad = minBidIncrementPermyriad;
    }

    event BidPlaced(uint256 indexed tokenId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed tokenId, address indexed winner, uint256 amount);
    event FundWithdrew(address indexed bidder, uint256 amount);

    mapping(uint256 => address) private _highestBidder;
    mapping(uint256 => uint256) private _highestBid;
    mapping(address => uint256) private _pendingReturns;

    uint256 private _minBidIncrementPermyriad;
    uint256 private _reservePrice;

    function setAuctionReservePrice(uint256 reservePrice) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _reservePrice = reservePrice;
    }

    function setAuctionMinBidIncrementPermyriad(uint256 minBidIncrementPermyriad)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(minBidIncrementPermyriad >= 0, "minIncrement should be >= 0.");
        _minBidIncrementPermyriad = minBidIncrementPermyriad;
    }

    function getAuctionReservePrice() external view returns (uint256 reservePrice) {
        return _reservePrice;
    }

    function getAuctionMinBidIncrementPermyriad() external view returns (uint256 minBidIncrementPermyriad) {
        return _minBidIncrementPermyriad;
    }

    function getHighestBid(uint256 tokenId) external view returns (address bidder, uint256 amount) {
        return (_highestBidder[tokenId], _highestBid[tokenId]);
    }

    function getPendingReturns(address bidder) external view returns (uint256 amount) {
        return _pendingReturns[bidder];
    }

    function placeBid(uint256 tokenId) external payable nonReentrant {
        require(!(tokenId > block.timestamp / 1 days), "Auction is not started.");
        require(!(tokenId < block.timestamp / 1 days), "Auction is ended.");

        uint256 amount = msg.value;

        require(!(amount < _reservePrice), "Must send more than reservePrice.");

        require(!(amount <= _highestBid[tokenId]), "Must send more than the highest bid.");

        require(
            !(amount < (_highestBid[tokenId] * (10000 + _minBidIncrementPermyriad)) / 10000),
            "Must send over the last bid by minBidIncrement permyriad."
        );

        if (_highestBidder[tokenId] == address(0)) {
            _safeMint(address(this), tokenId);
        } else {
            _pendingReturns[_highestBidder[tokenId]] += _highestBid[tokenId];
        }

        _highestBidder[tokenId] = msg.sender;
        _highestBid[tokenId] = amount;

        emit BidPlaced(tokenId, msg.sender, amount);
    }

    /// End the auction and send the highest bid
    /// to the beneficiary.
    function endAuction(uint256 tokenId) public nonReentrant {
        // It is a good guideline to structure functions that interact
        // with other contracts (i.e. they call functions or send Ether)
        // into three phases:
        // 1. checking conditions
        // 2. performing actions (potentially changing conditions)
        // 3. interacting with other contracts
        // If these phases are mixed up, the other contract could call
        // back into the current contract and modify the state or cause
        // effects (ether payout) to be performed multiple times.
        // If functions called internally include interaction with external
        // contracts, they also have to be considered interaction with
        // external contracts.

        require(block.timestamp / 1 days > tokenId, "Auction not yet ended.");
        require(
            _highestBidder[tokenId] != address(0) && _highestBid[tokenId] > 0,
            "There should be at least a bid for the date."
        );
        require(ownerOf(tokenId) == address(this), "Should not reclaim the auction.");
        require(
            msg.sender == _highestBidder[tokenId] || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Only winner or admin can claim the item."
        );

        _getFoundationAddress().transfer(_highestBid[tokenId]);
        _transfer(address(this), _highestBidder[tokenId], tokenId);

        emit AuctionEnded(tokenId, _highestBidder[tokenId], _highestBid[tokenId]);
    }

    function withdrawFund() external nonReentrant {
        require(_pendingReturns[msg.sender] > 0, "No pending returns.");

        uint256 amount = _pendingReturns[msg.sender];
        payable(msg.sender).transfer(amount);
        _pendingReturns[msg.sender] -= amount;

        emit FundWithdrew(msg.sender, amount);
    }

    function _safeMint(address to, uint256 tokenId) internal virtual;

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual;

    function ownerOf(uint256 tokenId) public view virtual returns (address);
}
