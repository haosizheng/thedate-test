// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IERC165 } from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import { IERC721Receiver } from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { Base64 } from "base64-sol/base64.sol";
import { DateTime } from "./libraries/DateTime.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import { IERC2981 } from "@openzeppelin/contracts/interfaces/IERC2981.sol";
import { IWETH } from "./interfaces/IWETH.sol";

contract TheDate is ERC721Enumerable, AccessControl, IERC2981, ReentrancyGuard, ERC721Holder {
    // ==== Roles ====
    bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");

    // ==== Parameters ====
    // == DAO controlled parameters ==
    uint256 public claimingPrice = 0.01 ether;
    uint256 public reservePrice = 0.01 ether;
    uint256 public minBidIncrementBps = 1000;
    uint256 public engravingPrice = 0.01 ether;
    uint256 public erasingPrice = 0.1 ether;
    uint256 public noteSizeLimit = 100;

    // == Admin controlled parameters ==
    uint256 private _royaltyBps = 1000;
    string private _tokenDescription = "The Date is a metadata-based NFT art experiment about time and blockchain. " 
        "Each fleeting day would be imprinted into an NFT artwork on blockchain immutably. " 
        "Optionally, the owner can engrave or erase a note on the artwork as an additional metadata. " 
        "Feel free to use the Date in any way you want.";
    string[] private _svgImageTemplate = [''
        '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 500 500">'
        '<rect width="100%" height="100%" fill="black" />'
        '<text x="50%" y="50%" fontSize="50px" fill="white" fontFamily="monospace" dominantBaseline="middle" textAnchor="middle">',
        '{{date}}',
        '</text><text x="50%" y="90%" fontSize="10px" fill="white" fontFamily="monospace" dominantBaseline="middle" textAnchor="middle">',
        '{{note}}',
        '</text></svg>'];

    // == External contracts ==
    address payable private immutable _foundation;
    address private immutable _weth;
    address private immutable _loot;

    // ==== Events ====
    // == Parameter-related Events ==
    event ClaimingPriceChanged(uint256 claimingPrice);
    event AuctionReservePriceChanged(uint256 reservePrice);
    event AuctionMinBidIncrementBpsChanged(uint256 minBidIncrementBps);
    event EngravingPriceChanged(uint256 amount);
    event ErasingPriceChanged(uint256 amount);
    event NoteSizeLimitChanged(uint256 length);

    // == Auction-related events ==
    event BidPlaced(uint256 indexed tokenId, address indexed bidder, uint256 amount);
    event AuctionSettled(uint256 indexed tokenId, address indexed winner, uint256 amount);
    event ArtworkClaimed(uint256 indexed tokenId, address indexed owner);
    event ArtworkAirdropped(uint256 indexed tokenId, address indexed owner);

    // == Note-related events ==
    event NoteEngraved(uint256 indexed tokenId, address indexed owner, string note);
    event NoteErased(uint256 indexed tokenId, address indexed owner);

    // ==== Storage ====
    // == Note ==
    mapping(uint256 => string) private _notes;

    // == Auction ==
    mapping(uint256 => address) private _highestBidder;
    mapping(uint256 => uint256) private _highestBid;
    uint256 _lastUnchaimedAuctionedTokenId = 0;
    
    // ==== Parameter Related Functions ==== 
    // == DAO controlled parameters ==
    function setClaimingPrice(uint256 claimingPrice_) external onlyRole(DAO_ROLE) {
        claimingPrice = claimingPrice_;
        emit ClaimingPriceChanged(claimingPrice);
    }

    function setAuctionReservePrice(uint256 reservePrice_) external onlyRole(DAO_ROLE) {
        reservePrice = reservePrice_;
        emit AuctionReservePriceChanged(reservePrice);
    }

    function setAuctionMinBidIncrementBps(uint256 minBidIncrementBps_) external onlyRole(DAO_ROLE) {
        minBidIncrementBps = minBidIncrementBps_;
        emit AuctionMinBidIncrementBpsChanged(minBidIncrementBps);
    }

    function setEngravingPrice(uint256 engravingPrice_) external onlyRole(DAO_ROLE) {
        engravingPrice = engravingPrice_;
        emit EngravingPriceChanged(engravingPrice_);
    }

    function setErasingPrice(uint256 erasingPrice_) external onlyRole(DAO_ROLE) {
        erasingPrice = erasingPrice_;
        emit ErasingPriceChanged(erasingPrice);
    }
    
    function setNoteSizeLimit(uint256 noteSizeLimit_) external onlyRole(DAO_ROLE) {
        noteSizeLimit = noteSizeLimit_;
        emit NoteSizeLimitChanged(noteSizeLimit);
    }

    // == Admin controlled parameters ==
    function setRoyaltyBps(uint256 royaltyBps_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(royaltyBps_ <= 10000, "royaltyBps should be within [0, 10000].");
        _royaltyBps = royaltyBps_;
    }

    function setTokenDescription(string memory tokenDescription_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _tokenDescription = tokenDescription_;
    }

    function setSVGImageTemplate(string[] memory svgImageTemplate_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _svgImageTemplate = svgImageTemplate_;
    }

    // ==== Owner related functions ==== 
    // == Owner related modifiers ==
    modifier onlyOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Caller should be the owner of the artwork.");
        _;
    }

    // == Note related operations ==
    modifier validNote(string memory note) {
        require(bytes(note).length < noteSizeLimit, "Note should be shorter than noteSizeLimit.");
        _;
    }

    function engraveNote(uint256 tokenId, string memory note) public payable onlyOwner(tokenId) validNote(note) {
        require(msg.value >= engravingPrice, "Should pay >= engravingPrice");
        require(bytes(_notes[tokenId]).length == 0, "Note should be empty before engraving");

        _notes[tokenId] = note;
        _safeTransferETHWithFallback(_foundation, msg.value);
        emit NoteEngraved(tokenId, ownerOf(tokenId), note);
    }

    function eraseNote(uint256 tokenId) public payable onlyOwner(tokenId) {
        require(msg.value >= erasingPrice, "Should pay >= erasingPrice");
        require(bytes(_notes[tokenId]).length > 0, "Note should be nonempty before erasing");

        _notes[tokenId] = "";
        _safeTransferETHWithFallback(_foundation, msg.value);
        emit NoteErased(tokenId, ownerOf(tokenId));
    }

    // ==== Metadata functions ====
    function getDate(uint256 tokenId) public pure returns (string memory) {
        (uint256 year, uint256 month, uint256 day) = DateTime.daysToDate(tokenId);
        string memory yearStr = Strings.toString(year);
        string memory monthStr = Strings.toString(month);
        if (bytes(monthStr).length == 1) {
            monthStr = string(abi.encodePacked("0", monthStr));
        }
        string memory dayStr = Strings.toString(day);
        if (bytes(dayStr).length == 1) {
            dayStr = string(abi.encodePacked("0", dayStr));
        }
        return string(abi.encodePacked(yearStr, "-", monthStr, "-", dayStr));
    }

    function getNote(uint256 tokenId) public view returns (string memory) {
        return _notes[tokenId];
    }
    
    function _stringEquals(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function generateSVGImage(uint256 tokenId) public view returns (string memory) {
        string memory date = getDate(tokenId);
        string memory note = getNote(tokenId);
        
        string memory output = "";
        for (uint i = 0; i < _svgImageTemplate.length; ++i) {
            string memory part;
            if (_stringEquals(_svgImageTemplate[i], "{{date}}")) {
                part = date;
            } else if (_stringEquals(_svgImageTemplate[i], "{{note}}")) {
                part = note;
            } else {
                part = _svgImageTemplate[i];
            }
            output = string(abi.encodePacked(output, part));
        }

        return output;
    }

    function generateMetadata(uint256 tokenId) public view returns (string memory) {
        string memory image = Base64.encode(
            bytes(generateSVGImage(tokenId))
        );

        string memory json = string(abi.encodePacked(
            '{"name": "The Date #', 
            Strings.toString(tokenId),
            ': ', 
            getDate(tokenId), 
            '", "description": "',
            _tokenDescription,
            '", "image": "data:image/svg+xml;base64,', 
            image, 
            '"}'
        ));

        return json;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        string memory output = string(abi.encodePacked(
            'data:application/json;base64,', 
            Base64.encode(bytes(generateMetadata(tokenId)))
        ));

        return output;
    }
    
    // ==== Claiming related functions ====
    function _claim(address to, uint256 tokenId) internal nonReentrant {
        require(tokenId < block.timestamp / 1 days, "Only past tokenId is claimable.");
        require(
            _highestBidder[tokenId] == address(0) && _highestBid[tokenId] == 0,
            "tokenId should not be auctioned."
        );
        require(!_exists(tokenId), "tokenId should not be claimed.");

        _safeMint(to, tokenId);
        
        emit ArtworkClaimed(tokenId, to);
    }

    function claim(uint256 tokenId) public nonReentrant payable {
        settleLastAuction();

        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || 
                IERC721(_loot).balanceOf(msg.sender) > 0 || 
                msg.value >= claimingPrice, "Should pay >= claiming price or own a Loot NFT");

        _claim(msg.sender, tokenId);

        if (msg.value > 0) {
            _safeTransferETHWithFallback(_foundation, msg.value);
        }
    }

    function airdrop(address[] memory addresses, uint256[] memory tokenIds) public onlyRole(DEFAULT_ADMIN_ROLE) {
        settleLastAuction();

        for (uint i = 0; i < tokenIds.length; ++i) {
            address to = addresses[i];
            uint256 tokenId = tokenIds[i];
            _claim(to, tokenId);

            emit ArtworkAirdropped(tokenId, to);
        }
    }

    // ==== Auction related functions ==== 
    function getHighestBid(uint256 tokenId) external view returns (address bidder, uint256 amount) {
        return (_highestBidder[tokenId], _highestBid[tokenId]);
    }

    function settleLastAuction() public nonReentrant {
        uint256 tokenId = _lastUnchaimedAuctionedTokenId;

        if (block.timestamp / 1 days > tokenId &&  _highestBidder[tokenId] != address(0) && _highestBid[tokenId] > 0 
            && !_exists(tokenId)) {
            _settleAuction(tokenId);
        }
    }

    function placeBid() public payable nonReentrant {
        uint256 tokenId = block.timestamp / 1 days;
        uint256 amount = msg.value;

        require(!(amount < reservePrice), "Must send more than reservePrice.");

        require(!(amount < (_highestBid[tokenId] * (10000 + minBidIncrementBps)) / 10000),
            "Must send more than last bid by minBidIncrementBps amount.");

        if (_highestBidder[tokenId] == address(0)) {
            settleLastAuction();
            _lastUnchaimedAuctionedTokenId = tokenId;
        } else {
            _safeTransferETHWithFallback(_highestBidder[tokenId], _highestBid[tokenId]);
        }

        _highestBidder[tokenId] = msg.sender;
        _highestBid[tokenId] = amount;

        emit BidPlaced(tokenId, msg.sender, amount);
    }

    /// @notice Settle the auction and send the highest bid to the beneficiary.
    function _settleAuction(uint256 tokenId) public nonReentrant {
        require(block.timestamp / 1 days > tokenId, "Auction not yet ended.");
        require(
            _highestBidder[tokenId] != address(0) && _highestBid[tokenId] > 0,
            "There should be at least a bid for the date."
        );
        require(!_exists(tokenId), "Should not reclaim the auction.");

        _mint(_highestBidder[tokenId], tokenId);
        _safeTransferETHWithFallback(_foundation, _highestBid[tokenId]);

        emit AuctionSettled(tokenId, _highestBidder[tokenId], _highestBid[tokenId]);
    }

    /// @notice Transfer ETH. If the ETH transfer fails, wrap the ETH and try send it as WETH.
    function _safeTransferETHWithFallback(address to, uint256 amount) internal {
        if (!_safeTransferETH(to, amount)) {
            IWETH(_weth).deposit{ value: amount }();
            IERC20(_weth).transfer(to, amount);
        }
    }

    /// @notice Transfer ETH and return the success status.
    /// @dev This function only forwards 30,000 gas to the callee.
    function _safeTransferETH(address to, uint256 value) internal returns (bool) {
        (bool success, ) = to.call{ value: value, gas: 30_000 }(new bytes(0));
        return success;
    }

    // ==== Constructor ====
    constructor(address foundation_,
                address weth_,
                address loot_) 
        ERC721("The Date", "DATE")
    {
        _foundation = payable(foundation_);
        _weth = weth_;
        _loot = loot_;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(DAO_ROLE, msg.sender);
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) 
        public view override(ERC721Enumerable, AccessControl, IERC165) returns (bool) 
    {
        return ERC721Enumerable.supportsInterface(interfaceId) ||
            AccessControl.supportsInterface(interfaceId) || 
            type(IERC2981).interfaceId == interfaceId ||
            type(IERC165).interfaceId == interfaceId ||        
            type(IERC721Receiver).interfaceId == interfaceId;
    }

    // ==== Royalty Functions ====
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external view override returns (address receiver, uint256 royaltyAmount)
    {
        return (_foundation, (salePrice * _royaltyBps) / 10000);
    }

    // Default functions
    receive() external payable {
        placeBid();
    }

    fallback() external payable {

    }
}
