// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@thefoundation/core-contracts/contracts/WithRoyalty.sol";
import "@thefoundation/core-contracts/contracts/WithFoundation.sol";
import "@thefoundation/core-contracts/contracts/MintedByFixedPrice.sol";

contract TheSecret is ERC721Enumerable, AccessControl, Pausable, WithFoundation, WithRoyalty, MintedByFixedPrice {
    constructor(address payable foundation_)
        ERC721("TheSecret", "SECRET")
        WithFoundation(foundation_)
        WithRoyalty(1000)
        MintedByFixedPrice(0.1 ether)
    {
        _setupRole(DEFAULT_ADMIN_ROLE, _getFoundationAddress());
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        setBaseURI("https://thesecret.art/api/");
    }

    // Basic Setup

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
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
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

    using Counters for Counters.Counter;
    using Address for address payable;

    struct TheSecretArtwork {
        string title;
        uint256 date;
        string encryptedNote;
        bytes32 noteHash;
    }

    event ArtworkMinted(uint256 indexed tokenId, string title, bytes32 noteHash);

    mapping(uint256 => TheSecretArtwork) public artworks;
    Counters.Counter private _tokenIds;

    function payToMint(
        string memory title,
        string memory encryptedNote,
        bytes32 noteHash,
        uint256[7] memory proof
    ) external payable whenNotPaused returns (uint256 tokenId) {
        _tokenIds.increment();
        tokenId = _tokenIds.current();

        //  require(verifyNote(artworks[tokenId].encryptedNote, noteHash, proof), "Invalid zk proof");
        _mintByFixedPrice(tokenId);
        artworks[tokenId] = TheSecretArtwork(title, block.timestamp / 1 days, encryptedNote, noteHash);

        emit ArtworkMinted(tokenId, title, noteHash);
    }

    mapping(uint256 => uint256) public prices;
    mapping(address => mapping(uint256 => uint256)) public escrow;

    event PriceSetted(uint256 tokenId, uint256 value);
    event Prepaid(address who, uint256 tokenId, uint256 value);
    event PrepaymentRefunded(address who, uint256 tokenId, uint256 value);

    function setPrice(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender);
        prices[tokenId] = price;
        emit PriceSetted(tokenId, price);
    }

    function prepayForTransfer(uint256 tokenId) external payable whenNotPaused {
        require(_exists(tokenId));
        escrow[msg.sender][tokenId] += msg.value;
        emit Prepaid(msg.sender, tokenId, msg.value);
    }

    function refundPrepayment(uint256 tokenId) external {
        require(escrow[msg.sender][tokenId] > 0, "escrow price > 0");
        uint256 refund = escrow[msg.sender][tokenId];
        Address.sendValue(payable(msg.sender), refund);
        escrow[msg.sender][tokenId] -= refund;
        emit PrepaymentRefunded(msg.sender, tokenId, refund);
    }

    function transferSecret(
        address to,
        uint256 tokenId,
        string memory recipientEncryptedNote,
        uint256[7] memory proof
    ) external whenNotPaused {
        require(ownerOf(tokenId) == msg.sender);
        require(escrow[to][tokenId] >= prices[tokenId], "The recipient did not prepay for the price.");
       // require(verifyTx(artworks[tokenId].encryptedNote, to, recipientEncryptedNote, proof), "Invalid zk proof");

        _transfer(msg.sender, to, tokenId);
        artworks[tokenId].encryptedNote = recipientEncryptedNote;
    }
}
