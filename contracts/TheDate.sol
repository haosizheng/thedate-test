// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IERC2981.sol";

contract TheDate is ERC721Enumerable, Pausable, AccessControl, IERC2981, ReentrancyGuard, ERC721Holder {
    bytes32 public constant ARTIST_ROLE = keccak256("ARTIST_ROLE");

    address payable private _foundationContract;
    string private _baseTokenURI;

    constructor(address payable foundationContract_) ERC721("TheDate", "DATE") {
        _setupRole(DEFAULT_ADMIN_ROLE, _foundationContract);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ARTIST_ROLE, _foundationContract);
        _setupRole(ARTIST_ROLE, msg.sender);

        _baseTokenURI = "https://thedate.art/token/";
        _foundationContract = foundationContract_;
        _reservePrice = 0.01 ether;
        _minBidIncrementPermyriad = 1000; //10%
        _royaltyPermyriad = 1000;
        addNewApperance("", "");
        defaultApperanceId = 0;
        messageSizeLimit = 256;
    }

    // NFT 721 Basics
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseTokenURI_) external {
        _baseTokenURI = baseTokenURI_;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal whenNotPaused override {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) 
        public view override(ERC721Enumerable, AccessControl, IERC165) returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }

    // The Date Art
    event DefaultApperanceChanged(uint256 indexed apperanceId);
    event ApperanceLocked(uint256 indexed apperanceId);
    event ApperanceUnlocked(uint256 indexed apperanceId);
    event ApperanceAdded(uint256 indexed apperanceId);
    event ApperanceUpdated(uint256 indexed apperanceId);
    event ArtworkMinted(uint256 indexed tokenId);
    event ArtworkMessageUpdated(uint256 indexed tokenId, string message);
    event ArtworkApperanceUpdated(uint256 indexed tokenId, uint256 indexed apperanceId);
    
    struct TheDateArtwork {
        uint256 dateId; //The day since UNIX epoch().
        string message;
        uint256 apperanceId;
    }

    struct TheDateArtAppearance {
        string metadata;
        string script;
        bool locked;
    }

    mapping (uint256 => TheDateArtwork) public artworks;
    TheDateArtAppearance[] public apperances;
    uint256 public defaultApperanceId;
    uint256 public messageSizeLimit;

    modifier validApperanceId(uint256 apperanceId) {
        require(apperanceId >= 0 && apperanceId < apperances.length, 
            "apperanceId should be within [0, apperances.length).");
        _;
    }

    modifier unlockedApperance(uint256 apperanceId) {
        require(!apperances[apperanceId].locked, 
            "apperances[apperanceId] should be unlocked.");
        _;
    }

    modifier lockedApperance(uint256 apperanceId) {
        require(apperances[apperanceId].locked, 
            "apperances[apperanceId] should be locked.");
        _;
    }

    modifier onlyOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, 
            "Caller should be the owner of the artwork.");
        _;
    }

    modifier validMessage(string memory message) {
        require(bytes(message).length < messageSizeLimit, 
            "Message should be shorter than messageSizeLimit.");
        _;
    }

    function setDefaultApperanceId(uint256 defaultApperanceId_) 
        external validApperanceId(defaultApperanceId_) lockedApperance(defaultApperanceId_) onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        defaultApperanceId = defaultApperanceId_;

        emit DefaultApperanceChanged(defaultApperanceId);
    }

    function addNewApperance(string memory metadata, string memory script) 
        public onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        TheDateArtAppearance memory apperance;
        apperance.metadata = metadata;
        apperance.script = script;
        apperance.locked = false;
        apperances.push(apperance);

        emit ApperanceAdded(apperances.length - 1);
    }

    function updateApperance(uint256 apperanceId, string memory metadata, string memory script) 
        external validApperanceId(apperanceId) unlockedApperance(apperanceId) onlyRole(ARTIST_ROLE) 
    {
        apperances[apperanceId].metadata = metadata;
        apperances[apperanceId].script = script;

        emit ApperanceUpdated(apperanceId);
    }

    function lockApperance(uint256 apperanceId) external
        validApperanceId(apperanceId) unlockedApperance(apperanceId) onlyRole(ARTIST_ROLE) 
    {
        apperances[apperanceId].locked = true;    
        emit ApperanceLocked(apperanceId);
    }

    function unlockApperance(uint256 apperanceId) external
        validApperanceId(apperanceId) lockedApperance(apperanceId) onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        apperances[apperanceId].locked = false;
        emit ApperanceUnlocked(apperanceId);
    }

    function _mintArtwork(uint256 tokenId) internal {
        _mint(address(this), tokenId);
        artworks[tokenId].dateId = tokenId;
        artworks[tokenId].message = "";
        artworks[tokenId].apperanceId = defaultApperanceId;

        emit ArtworkMinted(tokenId);
    }

    function setArtworkMessage(uint256 tokenId, string memory message) public onlyOwner(tokenId) validMessage(message)
    {
        artworks[tokenId].message = message;

        emit ArtworkMessageUpdated(tokenId, message);
    }

    function setArtworkApperanceId(uint256 tokenId, uint256 apperanceId) 
        public onlyOwner(tokenId) validApperanceId(apperanceId) lockedApperance(apperanceId) 
    {
        artworks[tokenId].apperanceId = apperanceId;
        
        emit ArtworkApperanceUpdated(tokenId, apperanceId);
    }

    // Royalty 
    uint256 private _royaltyPermyriad;

    function setRoyaltyPermyriad(uint256 royaltyPermyriad) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(royaltyPermyriad <= 10000 && royaltyPermyriad >= 0, 
            "royaltyPermyriad should be within [0, 10000].");
        _royaltyPermyriad = royaltyPermyriad;
    }

    function getRoyaltyPermyriad() external view returns (uint256 royaltyPermyriad) {
        return _royaltyPermyriad;
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice) external view override 
        returns (address receiver, uint256 royaltyAmount) 
    {
        return (_foundationContract, salePrice * _royaltyPermyriad / 10000);
    }

    // Auction logic 
    
    event BidPlaced(uint256 indexed tokenId, address indexed bidder, uint amount);
    event AuctionEnded(uint256 indexed tokenId, address indexed winner, uint amount);
    event FundWithdrew(address indexed bidder, uint amount);

    mapping (uint256 => address) private _highestBidder;
    mapping (uint256 => uint256) private _highestBid;
    mapping (address => uint256) private _pendingReturns;

    uint256 private _minBidIncrementPermyriad;
    uint256 private _reservePrice;

    function setAuctionReservePrice(uint256 reservePrice) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _reservePrice = reservePrice;
    }

    function setAuctionMinBidIncrementPermyriad(uint256 minBidIncrementPermyriad) external onlyRole(DEFAULT_ADMIN_ROLE) 
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

        require(!(amount < _highestBid[tokenId] * (10000 + _minBidIncrementPermyriad) / 10000),
            "Must send over the last bid by minBidIncrement permyriad."
        );

        if (_highestBidder[tokenId] == address(0)) {
            _mintArtwork(tokenId);
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
        require(_highestBidder[tokenId] != address(0) && _highestBid[tokenId] > 0, 
            "There should be at least a bid for the date.");
        require(ownerOf(tokenId) == address(this), "Should not reclaim the auction.");
        require(msg.sender == _highestBidder[tokenId] || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), 
            "Only winner or admin can claim the item.");

        _foundationContract.transfer(_highestBid[tokenId]);
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

    // Default functions
    receive() external payable {}
    fallback() external payable {}
}
