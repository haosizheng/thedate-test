// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@thefoundation/core-contracts/contracts/WithRoyalty.sol";
import "@thefoundation/core-contracts/contracts/WithFoundation.sol";
import "@thefoundation/core-contracts/contracts/MintedByFixedPrice.sol";
import "./TheNote.sol";

contract TheNoteProofOfBelief is ERC721Enumerable, AccessControl, WithFoundation, WithRoyalty, MintedByFixedPrice {
    TheNote private _theNoteContract;

    constructor(address payable foundation_, address theNoteContractAddress_)
        ERC721("TheNote ProofOfBelief", "NOTEPOB")
        WithFoundation(foundation_)
        WithRoyalty(1000)
        MintedByFixedPrice(0.01 ether)
    {
        _setupRole(DEFAULT_ADMIN_ROLE, _getFoundationAddress());
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        setBaseURI("https://thenote.art/api/pob/");
        _theNoteContract = TheNote(theNoteContractAddress_);
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
    struct ProofOfBelief {
        uint256 noteId;
        uint256 rank;
    }

    uint256 public constant MAX_POB_PER_NOTE = 1e18;

    mapping(uint256 => ProofOfBelief) public pobs;
    mapping(uint256 => uint256[]) public pobIdsByNoteId;

    function payToMint(uint256 noteId) external payable returns (uint256 tokenId) {
        require(_theNoteContract.ownerOf(noteId) != address(0), "nonexistent noteId");

        uint256 rank = pobIdsByNoteId[noteId].length + 1;
        tokenId = noteId * MAX_POB_PER_NOTE + rank;
        _mintByFixedPrice(tokenId);
        pobs[tokenId] = ProofOfBelief(noteId, rank);
        pobIdsByNoteId[noteId].push(tokenId);
    }

    function numberOfPobs(uint256 noteId) external view returns (uint256 length) {
        require(_theNoteContract.ownerOf(noteId) != address(0), "nonexistent noteId");
        return pobIdsByNoteId[noteId].length;
    }
}
