// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC165 } from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { Base64 } from "base64-sol/base64.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { IERC2981 } from "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract Superpower is ERC721Enumerable, AccessControl, IERC2981, ReentrancyGuard {
    // ==== Superpower ====
    string[] private vision = [
        "Astral",
        "Atomic",
        "Augmented Reality",
        "Aura",
        "Blood-Flow",
        "Chrono",
        "Dark",
        "Death",
        "Dimensional",
        "Electromagnetic",
        "Emotion",
        "Energy",
        "Gamma",
        "Healing",
        "Hypnotic",
        "Ionic",
        "Infrared",
        "Invisibility",
        "Laser",
        "Lightning",
        "Microscopic",
        "Multi-Directional",
        "Neon",
        "Night",
        "Probability",
        "Quantum",
        "Radioactive",
        "Soundwave",
        "Supernatural",
        "Ultraviolet",
        "X-Ray"
    ];
    
    string[] private mentalityBasedPower = [
        "4th Wall Awareness", 
        "Dual Mind", 
        "Enhanced Intelligence", 
        "Enhanced Memory", 
        "Enhanced Wits", 
        "Intuitive Aptitude",
        "Mentifery",
        "Omniscience",
        "Omnilingualism",
        "Botanical Communication",
        "Cyber Communication",
        "Extraterrestrial Communication",
        "Faunal Communication",
        "Psychic Shield",
        "Astral Projection",
        "Clairvoyance",
        "Danger Intuition",
        "Dimensional Awareness",
        "Extrasensory Perception",
        "Mendacity Detection",
        "Mental Projection",
        "Precognition",
        "Numerology",
        "Telepathy",
        "Dream Manipulation",
        "Emotion Manipulation",
        "Fear Inducement",
        "Hypnosis",
        "Memory Manipulation",
        "Mind Control",
        "Possession",
        "Siren Song",
        "Vocal Mind Control",
        "Belief Inducement",
        "Yin & Yang Manipulation"
    ];
    
    string[] private personalPhysicalPower = [
        "Additional Limbs",
        "Anatomical Liberation",
        "Body Part Substitution",
        "Bone Manipulation",
        "Camouflage",
        "Claw Retraction",
        "Deflection",
        "Fat Manipulation",
        "Invisibility",
        "Immobility",
        "Immutability",
        "Invulnerability",
        "Matter Ingestion",
        "Muscle Manipulation",
        "Needle Projection",
        "Regenerative Healing Factor",
        "Replication",
        "Self-Detonation",
        "Spike Protrusion",
        "Structure Weakening",
        "Tentacle Manifestation",
        "Vampire Physiology",
        "Wallcrawling"
    ];

    //add "Generation" in the end
    string[] private emission = [
        "Acid",
        "Ash",
        "Bubble",
        "Dust",
        "Fire",
        "Fog",
        "Goo",
        "Heat",
        "Miasma ",
        "Chlorine Gas",
        "Nerve Gas",
        "Oil",
        "Pheromone",
        "Poison",
        "Scald",
        "Laser",
        "Smoke",
        "Sonic",
        "Stench",
        "Water",
        "Web"
    ];
    
    //add "Adoption" in end
    string[] private adaptation = [
        "Aquatic",
        "Atmospheric",
        "Aerial",
        "Desert",
        "Subterranean",
        "Poison",
        "Reactive",
        "Thermal",
        "Vacuum",
        "Radiation"
    ];
    
    // add "Enhanced" in front
    string[] private enhancedPhysicalSkills = [
        "Accuracy",
        "Agility",
        "Combat",
        "Dexterity",
        "Durability",
        "Flexibility",
        "Leap",
        "Lung Capacity",
        "Hearing",
        "Smell",
        "Synesthesia",
        "Taste",
        "Touch",
        "Vision",
        "Stamina",
        "Strength",
        "Swordsmanship"
    ];

    // add "Manipulation" in the end
    string[] private realityManipulation = [
        "Dimensional",
        "Emotion",
        "Healing",
        "Life-Force Absorption",
        "Melting",
        "Mind Exchange",
        "Petrification",
        "Physical Restoration",
        "Age",
        "Biological",
        "Cosmic",
        "Darkness",
        "Fundamental Forces",
        "Gravity",
        "Light",
        "Rainbow",
        "Magnetism",
        "Mass",
        "Molecular",
        "Nerve",
        "Nothingness",
        "Physics",
        "Probability",
        "Reality Warping",
        "Solar",
        "Sound",
        "Spatial",
        "Weight",
        "Circadian",
        "Mirror",
        "Vector",
        "Air",
        "Smoke",
        "Animal",
        "Earth",
        "Crystal",
        "Metal",
        "Electricity",
        "Electromagnetism",
        "Fire",
        "Ice",
        "Plant",
        "Space-Time",
        "Particle Energy",
        "Fungus",
        "Water",
        "Vapor",
        "Weather",
        "Storm"
    ];

    string[] private travel = [
        "Cosmic Teleportation",
        "Dimensional Travel",
        "Electrical Transportation",
        "Portal Creation",
        "Speed Swimming",
        "Summoning",
        "Super Speed",
        "Teleportation",
        "Time Travel",
        "Wormhole Creation",
        "Flight"
        "Gliding",
        "Levitation",
        "Wing Manifestation"
    ];

    // add "Mimicry" in the end
    string[] private elementMimicry = [
        "Air",
        "Darkness",
        "Metal",
        "Gold",
        "Fire",
        "Magma",
        "Sand",
        "Ink",
        "Clay",
        "Slime",
        "Smoke",
        "Electricity",
        "Crystal",
        "Diamond",
        "Digital Form",
        "Electromagnetic Wave",
        "Ice",
        "Spatial",
        "Energy",
        "Dust"
    ];

    // add "Physiology" in the end
    string[] private organicMimicry = [
        "Scorpion",
        "Spider",
        "Owl",
        "Shark",
        "Ant",
        "Bee",
        "Butterfly",
        "Bat",
        "Camelid",
        "Cervid",
        "Cetacean",
        "Elephant",
        "Horse",
        "Feline",
        "Giraffe",
        "Lagomorph",
        "Procyonid",
        "Rhinoceros",
        "Dinosaur",
        "Dragon",
        "Pterosaur",
        "Snake",
        "Turtle",
        "Angel",
        "Demon",
        "Elf",
        "Ghost",
        "Merfolk",
        "Minotaur",
        "Phoenix",
        "Spirit",
        "Thunderbird",
        "Undead",
        "Unicorn",
        "Vampire",
        "Werewolf",
        "Transcendent",
        "Cosmic Entity"
    ];

    function getVision(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "vision", vision);
    }
    
    function getMentalityBasedPower(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "mentalityBasedPower", mentalityBasedPower);
    }
    
    function getPersonalPhysicalPower(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "personalPhysicalPower", personalPhysicalPower);
    }
    
    function getEmission(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "emission", emission);
    }

    function getAdaptation(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "adaptation", adaptation);
    }
    
    function getEnhancedPhysicalSkills(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "enhancedPhysicalSkills", enhancedPhysicalSkills);
    }
    
    function getRealityManipulation(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "realityManipulation", realityManipulation);
    }

    function getTravel(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "travel", travel);
    }
    
    function getElementMimicry(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "elementMimicry", elementMimicry);
    }

    function getOrganicMimicry(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "organicMimicry", organicMimicry);
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }
    
    function pluck(uint256 tokenId, string memory keyPrefix, string[] memory sourceArray) internal view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked(keyPrefix, Strings.toString(tokenId))));
        string memory output = string(abi.encodePacked(keyPrefix, ": "));
        uint256 greatness = rand % 10000;
        if (greatness > 5000) {
            output = string(abi.encodePacked(output, sourceArray[rand % sourceArray.length]));
        } else {
            output = string(abi.encodePacked(output, "(none)"));
        }
        return output;
    }

    function _stringEquals(string memory a, string memory b) internal pure returns (bool) {
        return bytes(a).length == bytes(b).length && keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b)));
    }

    function generateSVGImage(uint256 tokenId) public view returns (string memory) {
        string memory output = "";
        for (uint i = 0; i < svgImageTemplate.length; ++i) {
            string memory part;
            if (_stringEquals(svgImageTemplate[i], "{{vision}}")) {
                part = getVision(tokenId);
            } else if (_stringEquals(svgImageTemplate[i], "{{mentalityBasedPower}}")) {
                part = getMentalityBasedPower(tokenId);
            } else if (_stringEquals(svgImageTemplate[i], "{{personalPhysicalPower}}")) {
                part = getPersonalPhysicalPower(tokenId);
            } else if (_stringEquals(svgImageTemplate[i], "{{emission}}")) {
                part = getEmission(tokenId);
            } else if (_stringEquals(svgImageTemplate[i], "{{adaptation}}")) {
                part = getAdaptation(tokenId);
            } else if (_stringEquals(svgImageTemplate[i], "{{enhancedPhysicalSkills}}")) {
                part = getEnhancedPhysicalSkills(tokenId);
            } else if (_stringEquals(svgImageTemplate[i], "{{realityManipulation}}")) {
                part = getRealityManipulation(tokenId);
            } else if (_stringEquals(svgImageTemplate[i], "{{travel}}")) {
                part = getTravel(tokenId);
            } else if (_stringEquals(svgImageTemplate[i], "{{elementMimicry}}")) {
                part = getElementMimicry(tokenId);
            } else if (_stringEquals(svgImageTemplate[i], "{{organicMimicry}}")) {
                part = getOrganicMimicry(tokenId);
            } else {
                part = svgImageTemplate[i];
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
            '{"name": "Superpower Set #', 
            Strings.toString(tokenId),
            '", "description": "',
            tokenDescription,
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

    string public tokenDescription = "The Superpower is a metadata-based NFT art experiment. "
      "Feel free to use the Superpower in any way you want.";

    string[] public svgImageTemplate = [''
        '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">'
        '<rect width="100%" height="100%" fill="black" />'
        '<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>'
        '<style>.title { fill: white; font-family: serif; font-size: 14px; }</style>'
        '<text x="10" y="20" class="base">',
        '{{vision}}',
        '</text>'
        '</svg>'
    ];

    address payable private immutable _foundation;
    uint256 public royaltyBps = 1000;

    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external view override returns (address receiver, uint256 royaltyAmount)
    {
        return (_foundation, (salePrice * royaltyBps) / 10000);
    }

    function setRoyaltyBps(uint256 royaltyBps_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(royaltyBps_ <= 10000, "royaltyBps should be within [0, 10000]");
        royaltyBps = royaltyBps_;
    }

    function setTokenDescription(string memory tokenDescription_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        tokenDescription = tokenDescription_;
    }

    function setSVGImageTemplate(string[] memory svgImageTemplate_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        svgImageTemplate = svgImageTemplate_;
    }

    uint256 public currentTokenId = 0;
    uint256 private _claimingStairstepPrice = 0.01 ether;

    function getCurrentClaimingPrice() public view returns (uint256) {
        return (currentTokenId / 1000) * _claimingStairstepPrice;
    }

    function claim() external payable nonReentrant {
        require(currentTokenId + 1 <= 11111, "Limited to 11111 tokens");
        require(msg.value >= getCurrentClaimingPrice(), "Should pay by claimingStairstepPrice * stairstep");

        currentTokenId += 1;
        _safeMint(_msgSender(), currentTokenId);
        _foundation.transfer(msg.value); 
    }
    
    function supportsInterface(bytes4 interfaceId) 
        public view override(ERC721Enumerable, AccessControl, IERC165) returns (bool) 
    {
        return ERC721Enumerable.supportsInterface(interfaceId) ||
            AccessControl.supportsInterface(interfaceId) || 
            type(IERC2981).interfaceId == interfaceId ||
            type(IERC165).interfaceId == interfaceId;
    }

    constructor(address foundation_) ERC721("Superpower", "SPWR") {
        _foundation = payable(foundation_);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
}
