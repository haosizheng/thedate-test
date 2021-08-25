// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@thefoundation/core-contracts/contracts/WithRoyalty.sol";
import "@thefoundation/core-contracts/contracts/MintedByAuction.sol";
import "@thefoundation/core-contracts/contracts/WithFoundation.sol";

contract TheDate is ERC721Enumerable, AccessControl, WithFoundation, WithRoyalty, MintedByAuction {
    constructor(address payable foundation_)
        ERC721("TheDate", "DATE")
        WithFoundation(foundation_)
        WithRoyalty(1000)
        MintedByAuction(0.01 ether, 1000)
    {
        _setupRole(DEFAULT_ADMIN_ROLE, foundation_);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        setBaseURI("https://thedate.art/api/token/");
    }

    //Parameters 
    uint256 private _engravingPrice = 0 ether;
    uint256 private _erasingPrice = 1 ether;
    uint256 private _noteSizeLimit = 100;

    function setNoteSizeLimit(uint256 noteSizeLimit) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _noteSizeLimit = noteSizeLimit;
    }

    function setErasingPrice(uint256 erasingPrice) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _erasingPrice = erasingPrice;
    }
    
    function setEngravingPrice(uint256 engravingPrice) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _engravingPrice = engravingPrice;
    }

    function getNoteSizeLimit() public view returns (uint256)  {
        return _noteSizeLimit;
    }

    function getErasingPrice() public view returns (uint256) {
        return _erasingPrice;
    }
    
    function getEngravingPrice() public view returns (uint256) {
        return _engravingPrice;
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

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, MintedByAuction) {
        ERC721._transfer(from, to, tokenId);
    }

    function ownerOf(uint256 tokenId) public view override(ERC721, MintedByAuction) returns (address) {
        return ERC721.ownerOf(tokenId);
    }

    // The Date Art
    modifier onlyOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Caller should be the owner of the artwork.");
        _;
    }

    modifier validNote(string memory note) {
        require(bytes(note).length < _noteSizeLimit, "Note should be shorter than noteSizeLimit.");
        _;
    }

    event ArtworkMinted(uint256 indexed tokenId);
    event ArtworkNoteEngraved(uint256 indexed tokenId, address indexed owner, string note);
    event ArtworkNoteErased(uint256 indexed tokenId, address indexed owner);

    struct TheDateArtwork {
        uint256 date;
        string note;
    }

    mapping(uint256 => TheDateArtwork) public artworks;

    function _safeMint(address to, uint256 tokenId) internal virtual override(ERC721, MintedByAuction) {
        ERC721._safeMint(to, tokenId);

        artworks[tokenId].date = tokenId;
        artworks[tokenId].note = "";

        emit ArtworkMinted(tokenId);
    }

    function engraveArtworkNote(uint256 tokenId, string memory note) public payable onlyOwner(tokenId) validNote(note) {
        require(msg.value >= _engravingPrice, "Should pay >= engravingPrice");
        require(bytes(artworks[tokenId].note).length == 0, "Note should be empty before engraving");

        artworks[tokenId].note = note;

        emit ArtworkNoteEngraved(tokenId, ownerOf(tokenId), note);
    }

    function eraseArtworkNote(uint256 tokenId) public payable onlyOwner(tokenId) {
        require(msg.value >= _erasingPrice, "Should pay >= erasingPrice");
        require(bytes(artworks[tokenId].note).length > 0, "Note should be nonempty before erasing");

        artworks[tokenId].note = "";

        emit ArtworkNoteErased(tokenId, ownerOf(tokenId));
    }

    // Default functions
    receive() external payable {}

    fallback() external payable {}
}
