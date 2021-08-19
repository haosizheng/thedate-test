// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@thefoundation/core-contracts/contracts/WithRoyalty.sol";
import "@thefoundation/core-contracts/contracts/WithFoundation.sol";
import "@thefoundation/core-contracts/contracts/MintedByFixedPrice.sol";

contract TheNote is ERC721Enumerable, AccessControl, WithFoundation, WithRoyalty, MintedByFixedPrice {
    uint256 private _noteSizeLimit = 256;

    constructor(address payable foundation_)
        ERC721("TheNote", "NOTE")
        WithFoundation(foundation_)
        WithRoyalty(1000)
        MintedByFixedPrice(0.1 ether)
    {
        _setupRole(DEFAULT_ADMIN_ROLE, foundation_);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        setBaseURI("https://thenote.art/api/token/");
    }

    // Base URI Setup

    string private _baseTokenURI;

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseTokenURI) public {
        _baseTokenURI = baseTokenURI;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, WithRoyalty, AccessControl)
        returns (bool)
    {
        return
            ERC721Enumerable.supportsInterface(interfaceId) ||
            WithRoyalty.supportsInterface(interfaceId) ||
            AccessControl.supportsInterface(interfaceId);
    }

    function _safeMint(address to, uint256 tokenId) internal virtual override(ERC721, MintedByFixedPrice) {
        return ERC721._safeMint(to, tokenId);
    }

    // Main Logic

    struct TheNoteArtwork {
        string note;
        uint256 date;
    }

    event ArtworkMinted(uint256 indexed tokenId);

    mapping(uint256 => TheNoteArtwork) public artworks;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    modifier validNote(string memory note) {
        require(bytes(note).length < _noteSizeLimit, "Note should be shorter than noteSizeLimit.");
        _;
    }

    function payToMint(string memory note) external payable validNote(note) returns (uint256 tokenId) {
        _tokenIds.increment();
        tokenId = _tokenIds.current();
        _mintByFixedPrice(tokenId);
        artworks[tokenId] = TheNoteArtwork(note, block.timestamp / 1 days);
        emit ArtworkMinted(tokenId);
    }
}
