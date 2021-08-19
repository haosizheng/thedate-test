
    event DefaultApperanceChanged(uint256 indexed apperanceId);
    event ApperanceLocked(uint256 indexed apperanceId);
    event ApperanceUnlocked(uint256 indexed apperanceId);
    event ApperanceAdded(uint256 indexed apperanceId);
    event ApperanceUpdated(uint256 indexed apperanceId);
    
    struct TheDateArtAppearance {
        string metadata;
        string script;
        bool locked;
    }

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
    event ArtworkApperanceUpdated(uint256 indexed tokenId, uint256 indexed apperanceId);
    function setArtworkApperanceId(uint256 tokenId, uint256 apperanceId) 
        public onlyOwner(tokenId) validApperanceId(apperanceId) lockedApperance(apperanceId) 
    {
        artworks[tokenId].apperanceId = apperanceId;
        
        emit ArtworkApperanceUpdated(tokenId, apperanceId);
    }
    

