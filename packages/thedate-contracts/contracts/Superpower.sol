// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import { IERC165 } from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { Base64 } from "base64-sol/base64.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { IERC2981 } from "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract Superpower is ERC721Enumerable, Ownable, IERC2981, ReentrancyGuard {
    // ==== Superpower ====
    string[] private vision = [
        "Astral Vision",
        "Atomic Vision",
        "Augmented Reality Vision",
        "Aura Vision",
        "Blood-Flow Vision",
        "Chrono Vision",
        "Dark Vision",
        "Death Vision",
        "Dimensional Vision",
        "Electromagnetic Vision",
        "Emotion Vision",
        "Energy Vision",
        "Gamma Vision",
        "Healing Vision",
        "Hypnotic Vision",
        "Ionic Vision",
        "Infrared Vision",
        "Invisibility Vision",
        "Laser Vision",
        "Lightning Vision",
        "Microscopic Vision",
        "Multi-Directional Vision",
        "Neon Vision",
        "Night Vision",
        "Probability Vision",
        "Quantum Vision",
        "Radioactive Vision",
        "Soundwave Vision",
        "Supernatural Vision",
        "Ultraviolet Vision",
        "X-Ray Vision"
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
        "Acid Generation",
        "Ash Generation",
        "Bubble Generation",
        "Dust Generation",
        "Fire Generation",
        "Fog Generation",
        "Goo Generation",
        "Heat Generation",
        "Miasma  Generation",
        "Chlorine Gas Generation",
        "Nerve Gas Generation",
        "Oil Generation",
        "Pheromone Generation",
        "Poison Generation",
        "Scald Generation",
        "Laser Generation",
        "Smoke Generation",
        "Sonic Generation",
        "Stench Generation",
        "Water Generation",
        "Web Generation"
    ];
    
    //add "Adoption" in end
    string[] private adaptation = [
        "Aquatic Adoption",
        "Atmospheric Adoption",
        "Aerial Adoption",
        "Desert Adoption",
        "Subterranean Adoption",
        "Poison Adoption",
        "Reactive Adoption",
        "Thermal Adoption",
        "Vacuum Adoption",
        "Radiation Adoption"
    ];
    
    // add "Enhanced" in front
    string[] private enhancedPhysicalSkills = [
        "Enhanced Accuracy",
        "Enhanced Agility",
        "Enhanced Combat",
        "Enhanced Dexterity",
        "Enhanced Durability",
        "Enhanced Flexibility",
        "Enhanced Leap",
        "Enhanced Lung Capacity",
        "Enhanced Hearing",
        "Enhanced Smell",
        "Enhanced Synesthesia",
        "Enhanced Taste",
        "Enhanced Touch",
        "Enhanced Vision",
        "Enhanced Stamina",
        "Enhanced Strength",
        "Enhanced Swordsmanship"
    ];

    // add "Manipulation" in the end
    string[] private realityManipulation = [
        "Dimensional Manipulation",
        "Emotion Manipulation",
        "Healing Manipulation",
        "Life-Force Absorption Manipulation",
        "Melting Manipulation",
        "Mind Exchange Manipulation",
        "Petrification Manipulation",
        "Physical Restoration Manipulation",
        "Age Manipulation",
        "Biological Manipulation",
        "Cosmic Manipulation",
        "Darkness Manipulation",
        "Fundamental Forces Manipulation",
        "Gravity Manipulation",
        "Light Manipulation",
        "Rainbow Manipulation",
        "Magnetism Manipulation",
        "Mass Manipulation",
        "Molecular Manipulation",
        "Nerve Manipulation",
        "Nothingness Manipulation",
        "Physics Manipulation",
        "Probability Manipulation",
        "Reality Warping Manipulation",
        "Solar Manipulation",
        "Sound Manipulation",
        "Spatial Manipulation",
        "Weight Manipulation",
        "Circadian Manipulation",
        "Mirror Manipulation",
        "Vector Manipulation",
        "Air Manipulation",
        "Smoke Manipulation",
        "Animal Manipulation",
        "Earth Manipulation",
        "Crystal Manipulation",
        "Metal Manipulation",
        "Electricity Manipulation",
        "Electromagnetism Manipulation",
        "Fire Manipulation",
        "Ice Manipulation",
        "Plant Manipulation",
        "Space-Time Manipulation",
        "Particle Energy Manipulation",
        "Fungus Manipulation",
        "Water Manipulation",
        "Vapor Manipulation",
        "Weather Manipulation",
        "Storm Manipulation"
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
        "Air Mimicry",
        "Darkness Mimicry",
        "Metal Mimicry",
        "Gold Mimicry",
        "Fire Mimicry",
        "Magma Mimicry",
        "Sand Mimicry",
        "Ink Mimicry",
        "Clay Mimicry",
        "Slime Mimicry",
        "Smoke Mimicry",
        "Electricity Mimicry",
        "Crystal Mimicry",
        "Diamond Mimicry",
        "Digital Form Mimicry",
        "Electromagnetic Wave Mimicry",
        "Ice Mimicry",
        "Spatial Mimicry",
        "Energy Mimicry",
        "Dust Mimicry"
    ];

    // add "Physiology" in the end
    string[] private organicMimicry = [
        "Scorpion Physiology",
        "Spider Physiology",
        "Owl Physiology",
        "Shark Physiology",
        "Ant Physiology",
        "Bee Physiology",
        "Butterfly Physiology",
        "Bat Physiology",
        "Camelid Physiology",
        "Cervid Physiology",
        "Cetacean Physiology",
        "Elephant Physiology",
        "Horse Physiology",
        "Feline Physiology",
        "Giraffe Physiology",
        "Lagomorph Physiology",
        "Procyonid Physiology",
        "Rhinoceros Physiology",
        "Dinosaur Physiology",
        "Dragon Physiology",
        "Pterosaur Physiology",
        "Snake Physiology",
        "Turtle Physiology",
        "Angel Physiology",
        "Demon Physiology",
        "Elf Physiology",
        "Ghost Physiology",
        "Merfolk Physiology",
        "Minotaur Physiology",
        "Phoenix Physiology",
        "Spirit Physiology",
        "Thunderbird Physiology",
        "Undead Physiology",
        "Unicorn Physiology",
        "Vampire Physiology",
        "Werewolf Physiology",
        "Transcendent Physiology",
        "Cosmic Entity Physiology"
    ];

    function getVision(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "vision", vision, 5000);
    }
    
    function getMentalityBasedPower(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "mentalityBasedPower", mentalityBasedPower, 5000);
    }
    
    function getPersonalPhysicalPower(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "personalPhysicalPower", personalPhysicalPower, 5000);
    }
    
    function getEmission(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "emission", emission, 5000);
    }

    function getAdaptation(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "adaptation", adaptation, 5000);
    }
    
    function getEnhancedPhysicalSkills(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "enhancedPhysicalSkills", enhancedPhysicalSkills, 5000);
    }
    
    function getRealityManipulation(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "realityManipulation", realityManipulation, 5000);
    }

    function getTravel(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "travel", travel, 5000);
    }
    
    function getElementMimicry(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "elementMimicry", elementMimicry, 5000);
    }

    function getOrganicMimicry(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "organicMimicry", organicMimicry, 5000);
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }
    
    function pluck(uint256 tokenId, string memory keyPrefix, string[] memory sourceArray, uint256 thresholdBps) internal pure returns (string memory) {
        uint256 rand = random(string(abi.encodePacked(keyPrefix, Strings.toString(tokenId))));
        string memory output = "";
        uint256 likelihood = rand % 10000;
        if (likelihood > thresholdBps) {
            uint256 greatness = rand % 100;
            output = string(abi.encodePacked(output, sourceArray[rand % sourceArray.length]));
            if (greatness > 98) {
                output = string(abi.encodePacked(output, " +3"));
            } else if (greatness > 90) {
                output = string(abi.encodePacked(output, " +2"));
            }  else if (greatness > 80) {
                output = string(abi.encodePacked(output, " +1"));
            }
        } 
        return output;
    }

    function _stringEquals(string memory a, string memory b) internal pure returns (bool) {
        return bytes(a).length == bytes(b).length && keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b)));
    }

    function getSuperpowerSet(uint256 tokenId) public view returns (string[10] memory output) {
        string[10] memory abilities = [
            getVision(tokenId),
            getMentalityBasedPower(tokenId),
            getPersonalPhysicalPower(tokenId),
            getEmission(tokenId),
            getAdaptation(tokenId),
            getEnhancedPhysicalSkills(tokenId),
            getRealityManipulation(tokenId),
            getTravel(tokenId),
            getElementMimicry(tokenId),
            getOrganicMimicry(tokenId)
        ];
        uint abilityCount = 0;
        for (uint i = 0; i < 10; i++) {
            if (bytes(abilities[i]).length > 0) {
                output[abilityCount++] = abilities[i];
            }
        }
    }

    function generateSVGImage(uint256 tokenId) public view returns (string memory output) {
        string[10] memory superpowers = getSuperpowerSet(tokenId);
        output = "";
        for (uint i = 0; i < svgImageTemplate.length; ++i) {
            string memory part;
            if (_stringEquals(svgImageTemplate[i], "{{tokenId}}")) {
                part = Strings.toString(tokenId);
            } else if (_stringEquals(svgImageTemplate[i], "{{superpower1}}")) {
                part = superpowers[0];
            } else if (_stringEquals(svgImageTemplate[i], "{{superpower2}}")) {
                part = superpowers[1];
            } else if (_stringEquals(svgImageTemplate[i], "{{superpower3}}")) {
                part = superpowers[2];
            } else if (_stringEquals(svgImageTemplate[i], "{{superpower4}}")) {
                part = superpowers[3];
            } else if (_stringEquals(svgImageTemplate[i], "{{superpower5}}")) {
                part = superpowers[4];
            } else if (_stringEquals(svgImageTemplate[i], "{{superpower6}}")) {
                part = superpowers[5];
            } else if (_stringEquals(svgImageTemplate[i], "{{superpower7}}")) {
                part = superpowers[6];
            } else if (_stringEquals(svgImageTemplate[i], "{{superpower8}}")) {
                part = superpowers[7];
            } else if (_stringEquals(svgImageTemplate[i], "{{superpower9}}")) {
                part = superpowers[8];
            } else if (_stringEquals(svgImageTemplate[i], "{{superpower10}}")) {
                part = superpowers[9];
            } else {
                part = svgImageTemplate[i];
            }
            output = string(abi.encodePacked(output, part));
        }
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

    string public tokenDescription = "The Superpower is a randomized superpowers generated and stored on chain. "
        "Stats, images, and other functionality are intentionally omitted for others to interpret. "
        "Feel free to use Superpower in any way you want.";

    string[] public svgImageTemplate = [''
        '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">'
        '<rect width="100%" height="100%" fill="black" />'
        '<style>.base { fill: white; font-family: serif; dominant-baseline: middle; text-anchor: start; font-size: 18px; }</style>'
        '<style>.title { fill: white; font-family: serif; dominant-baseline: middle; text-anchor: end; font-size: 14px; }</style>'
        '<text x="95%" y="30" class="title">Superpower Set #',
        '{{tokenId}}',
        '</text>'
        '<text x="30" y="50%" class="base">',
        '{{superpower1}}',
        '</text>'
        '<text x="30" y="57%" class="base">',
        '{{superpower2}}',
        '</text>'
        '<text x="30" y="43%" class="base">',
        '{{superpower3}}',
        '</text>'
        '<text x="30" y="64%" class="base">',
        '{{superpower4}}',
        '</text>'
        '<text x="30" y="36%" class="base">',
        '{{superpower5}}',
        '</text>'
        '<text x="30" y="71%" class="base">',
        '{{superpower6}}',
        '</text>'
        '<text x="30" y="29%" class="base">',
        '{{superpower7}}',
        '</text>'
        '<text x="30" y="78%" class="base">',
        '{{superpower8}}',
        '</text>'
        '<text x="30" y="22%" class="base">',
        '{{superpower9}}',
        '</text>'
        '<text x="30" y="85%" class="base">',
        '{{superpower10}}',
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

    function setRoyaltyBps(uint256 royaltyBps_) external onlyOwner {
        require(royaltyBps_ <= 10000, "royaltyBps should be within [0, 10000]");
        royaltyBps = royaltyBps_;
    }

    function setTokenDescription(string memory tokenDescription_) external onlyOwner {
        tokenDescription = tokenDescription_;
    }

    function setSVGImageTemplate(string[] memory svgImageTemplate_) external onlyOwner {
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
        public view override(ERC721Enumerable, IERC165) returns (bool) 
    {
        return ERC721Enumerable.supportsInterface(interfaceId) ||
            type(IERC2981).interfaceId == interfaceId ||
            type(IERC165).interfaceId == interfaceId;
    }

    constructor(address foundation_) ERC721("Superpower", "SPWR") {
        _foundation = payable(foundation_);
    }
}
