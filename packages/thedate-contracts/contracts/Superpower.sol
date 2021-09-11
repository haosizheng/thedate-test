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
        "360-Degree",
        "Accelerated",
        "Astral",
        "Atomic",
        "Augmented Reality",
        "Aura",
        "Blood-Flow",
        "Caustic",
        "Chaotic",
        "Chemo",
        "Chrono",
        "Color",
        "Dark",
        "Death",
        "Digital",
        "Dimensional",
        "DNA",
        "Ectoplasmic",
        "Electromagnetic",
        "Emotion",
        "Energy",
        "Explosion",
        "Fire",
        "Freeze",
        "Gamma",
        "Graphic",
        "Healing",
        "Heat",
        "Hypnotic",
        "Illusion",
        "Ionic",
        "Infrared",
        "Invisibility",
        "Kinetic",
        "Laser",
        "Life",
        "Light",
        "Lightning",
        "Lunar",
        "Magic",
        "Merging",
        "Microscopic",
        "Microwave",
        "Movement",
        "Multi-Directional",
        "Multiple",
        "Neon",
        "Night",
        "Oil",
        "Organic",
        "Photography",
        "Plasma",
        "Probability",
        "Quantum",
        "Radio",
        "Radioactive",
        "Scanner",
        "Shared",
        "Slime",
        "Soundwave",
        "Supercolor",
        "Supernatural",
        "Telekinetic",
        "Telescopic",
        "Timeline-Shared",
        "Ultimate",
        "Ultraviolet",
        "Wind",
        "X-Ray"
    ];
    
    string[] private mentalityBasedPower = [
        "4th Wall Awareness", 
        "Dual Mind", 
        "Ecological Empathy",
        "Enhanced Intelligence", 
        "Supernatural Intelligence", 
        "Enhanced Memory", 
        "Enhanced Wits", 
        "Supernatural Wits",
        "Feral Mind",
        "Intuitive Aptitude",
        "Knowledge Replication",
        "Mentifery",
        "Omniscience",
        "Omnilingualism",
        "Botanical Communication",
        "Cyber Communication",
        "Extraterrestrial Communication",
        "Faunal Communication",
        "Psychic Navigation",
        "Psychic Shield",
        "Technology Manipulation",
        "Astral Projection",
        "Claircognizance",
        "Clairvoyance",
        "Danger Intuition",
        "Dimensional Awareness",
        "Empathy",
        "Extrasensory Perception",
        "Mediumship",
        "Mendacity Detection",
        "Mental Projection",
        "Offspring Detection",
        "Precognition",
        "Abacomancy",
        "Numerology",
        "Oneiromancy",
        "Psychometry",
        "Retrocognition",
        "Telepathy",
        "Astral Trapping",
        "Dream Manipulation",
        "Emotion Manipulation",
        "Fear Inducement",
        "Hypnosis",
        "Memory Manipulation",
        "Mental Manipulation",
        "Mind Control",
        "Mindscape Transportation",
        "Possession",
        "Psionic Inundation",
        "Psychic Constructs",
        "Siren Song",
        "Social Cloaking",
        "Vertigo Inducement",
        "Vocal Mind Control",
        "Belief Inducement",
        "Unconsciousness Inducement",
        "Yin & Yang Manipulation"
    ];
    
    string[] private personalPhysicalPower = [
        "Accelerated Rotation",
        "Additional Limbs",
        "Adoptive Muscle Memory",
        "Amalgamation",
        "Plant Merging",
        "Solid Merging",
        "Anatomical Liberation",
        "Body Part Substitution",
        "Bone Manipulation",
        "Camouflage",
        "Claw Retraction",
        "Deflection",
        "Fang Retraction",
        "Fat Manipulation",
        "Helicopter Propulsion",
        "Invisibility",
        "Immobility",
        "Immutability",
        "Invulnerability",
        "Jet Propulsion",
        "Matter Ingestion",
        "Mobile Invulnerability",
        "Muscle Manipulation",
        "Nail Manipulation",
        "Needle Projection",
        "Organic Constructs",
        "Prehensile Hair",
        "Prehensile Tail",
        "Prehensile Tongue",
        "Regenerative Healing Factor",
        "Replication",
        "Self-Detonation",
        "Sharp Tail",
        "Spike Protrusion",
        "Structure Weakening",
        "Tentacle Manifestation",
        "Tendril Generation",
        "Vampire Physiology",
        "Wallcrawling"
    ];
    
    string[] private emission = [
        "Acid Generation",
        "Ash Generation",
        "Bubble Generation",
        "Dust Generation",
        "Powder Generation",
        "Echolocation",
        "Enhanced Breath",
        "Fire Breath",
        "Fire Generation",
        "Fog Generation",
        "Goo Generation",
        "Heat Generation",
        "Ink Generation",
        "Miasma Emission",
        "Chlorine Gas Generation",
        "Nerve Gas Generation",
        "Poison Gas Generation",
        "Oil Generation",
        "Pheromone Manipulation",
        "Poison Generation",
        "Scald Generation",
        "Smoke Generation",
        "Sonic Scream",
        "Stench Generation",
        "Water Generation",
        "Web Generation"
    ];
    
    string[] private adaptation = [
        "Aquatic Breathing",
        "Atmospheric Adaptation",
        "Environmental Adaptation",
        "Aerial Adaptation",
        "Arctic Adaptation",
        "Desert Adaptation",
        "Fallout Adaptation",
        "Mountain Adaptation",
        "Subterranean Adaptation",
        "Wetland Adaptation",
        "Poison Immunity",
        "Reactive Adaptation",
        "Self-Sustenance",
        "Thermal Resistance",
        "Tracking Evasion",
        "Vacuum Adaptation"
    ];
    
    string[] private enhancedPhysicalSkills = [
        "Enhanced Accuracy",
        "Enhanced Agility",
        "Enhanced Combat",
        "Enhanced Condition",
        "Enhanced Crafting",
        "Enhanced Dexterity",
        "Enhanced Durability",
        "Enhanced Flexibility",
        "Enhanced Leap",
        "Enhanced Lung Capacity",
        "Enhanced Reflexes",
        "Enhanced Senses",
        "Enhanced Hearing",
        "Enhanced Smell",
        "Enhanced Synesthesia",
        "Enhanced Taste",
        "Enhanced Touch",
        "Enhanced Vision",
        "Hyper Awareness",
        "Enhanced Stamina",
        "Enhanced Strength",
        "Enhanced Swordsmanship",
        "Enhanced Thievery",
        "Enhanced Visibility",
        "Powerful Bite"
    ];

    string[] private supernaturalPhysicalSkills = [
      "Supernatural Accuracy",
      "Supernatural Agility",
      "Supernatural Combat",
      "Supernatural Condition",
      "Supernatural Dexterity",
      "Supernatural Durability",
      "Supernatural Flexibility",
      "Supernatural Leap",
      "Supernatural Reflexes",
      "Supernatural Senses",
      "Supernatural Hearing",
      "Supernatural Smell",
      "Supernatural Taste",
      "Supernatural Touch",
      "Supernatural Vision",
      "Supernatural Stamina",
      "Supernatural Strength",
      "Supernatural Swordsmanship",
      "Supernatural Thievery"
    ];

    string[] private realityManipulation = [
        "Access and Occlusion",
        "Activation & Deactivation",
        "Animation",
        "Cloaking",
        "Death Inducement",
        "Dehydration",
        "Deoxygenation",
        "Dimensional Storage",
        "Disintegration",
        "Emotion Manipulation",
        "Healing",
        "Intangibility",
        "Life-Force Absorption",
        "Melting",
        "Mind Exchange",
        "Paralysis Inducement",
        "Petrification",
        "Physical Restoration",
        "Projected Thermography",
        "Sedation Inducement",
        "Self-Spawn",
        "Age Manipulation",
        "Aura Manipulation",
        "Biological Manipulation",
        "Cosmic Manipulation",
        "Darkness Manipulation",
        "Density Control",
        "Elemental Transmutation",
        "Fundamental Forces Manipulation",
        "Gravity Manipulation",
        "Light Manipulation",
        "Color Manipulation",
        "Rainbow Manipulation",
        "Lunar Manipulation",
        "Magnetism Manipulation",
        "Mass Manipulation",
        "Molecular Manipulation",
        "Nerve Manipulation",
        "Nothingness Manipulation",
        "Physics Manipulation",
        "Pressure Manipulation",
        "Probability Manipulation",
        "Reality Warping",
        "Reanimation",
        "Solar Manipulation",
        "Sound Manipulation",
        "Spatial Manipulation",
        "Temporal Manipulation",
        "Weight Manipulation",
        "Circadian Manipulation",
        "Ink Manipulation",
        "Literary Manipulation",
        "Mirror Manipulation",
        "Oil Manipulation",
        "Season Manipulation",
        "Vector Manipulation",
        "Air Manipulation",
        "Smoke Manipulation",
        "Animal Manipulation",
        "Amphibian Manipulation",
        "Arachnid Manipulation",
        "Avian Manipulation",
        "Fish Manipulation",
        "Insect Manipulation",
        "Mammal Manipulation",
        "Reptile Manipulation",
        "Ash Manipulation",
        "Dust Manipulation",
        "Earth Manipulation",
        "Crystal Manipulation",
        "Glass Manipulation",
        "Magma Manipulation",
        "Metal Manipulation",
        "Sand Manipulation",
        "Electricity Manipulation",
        "Electromagnetism Manipulation",
        "Fire Manipulation",
        "Ice Manipulation",
        "Plant Manipulation",
        "Flower Manipulation",
        "Space-Time Manipulation",
        "Particle Energy Manipulation",
        "Fruit/Vegetable Manipulation",
        "Fungus Manipulation",
        "Nature Manipulation",
        "Paper Manipulation",
        "Plant Growth",
        "Pollen Manipulation",
        "Wood Manipulation",
        "Water Manipulation",
        "Vapor Manipulation",
        "Weather Manipulation",
        "Cloud Manipulation",
        "Storm Manipulation"
    ];

    string[] private travel = [
        "Beacon Emission",
        "Burrowing",
        "Cosmic Teleportation",
        "Dimensional Travel",
        "Electrical Transportation",
        "Escape Artistry",
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

    string[] private elementMimicry = [
        "Air Mimicry",
        "Darkness Mimicry",
        "Metal Mimicry",
        "Gold Mimicry",
        "Inorganic Mimicry",
        "Fire Mimicry",
        "Magma Mimicry",
        "Sand Mimicry",
        "Ink Mimicry",
        "Elemental Mimicry",
        "Clay Mimicry",
        "Slime Mimicry",
        "Smoke Mimicry",
        "Electricity Mimicry",
        "Crystal Mimicry",
        "Diamond Mimicry",
        "Paper Mimicry",
        "Digital Form",
        "Tachyon Mimicry",
        "Electromagnetic Wave Physiology",
        "Ice Mimicry",
        "Stellar Physiology",
        "Spatial Mimicry",
        "Artificially Enhanced Physiology",
        "Energy Physiology",
        "Dust Mimicry",
        "Ash Mimicry"
    ];

    string[] private organicMimicry = [
        "Animal Morphing",
        "Amphibian Physiology",
        "Arachnid Physiology",
        "Scorpion Physiology",
        "Spider Physiology",
        "Avian Physiology",
        "Corvid Physiology",
        "Owl Physiology",
        "Parrot Physiology",
        "Fish Physiology",
        "Shark Physiology",
        "Insect Physiology",
        "Ant Physiology",
        "Bee Physiology",
        "Beetle Physiology",
        "Blattodea Physiology",
        "Butterfly Physiology",
        "Moth Physiology",
        "Cephalopod Physiology",
        "Cnidarian Physiology",
        "Crustacean Physiology",
        "Echinoderm Physiology",
        "Mammalian Physiology",
        "Bat Physiology",
        "Bovine Physiology",
        "Camelid Physiology",
        "Canine Physiology",
        "Cervid Physiology",
        "Cetacean Physiology",
        "Elephant Physiology",
        "Equid Physiology",
        "Horse Physiology",
        "Feline Physiology",
        "Giraffe Physiology",
        "Hyena Physiology",
        "Lagomorph Physiology",
        "Marsupial Physiology",
        "Mongoose Physiology",
        "Monotreme Physiology",
        "Pinniped Physiology",
        "Primate Physiology",
        "Procyonid Physiology",
        "Prosimian Physiology",
        "Rhinoceros Physiology",
        "Rodent Physiology",
        "Sirenia Physiology",
        "Ursine Physiology",
        "Xenarthra Physiology",
        "Parasite Physiology",
        "Reptilian Physiology",
        "Dinosaur Physiology",
        "Dragon Physiology",
        "Pterosaur Physiology",
        "Snake Physiology",
        "Tortoise Physiology",
        "Turtle Physiology",
        "Chimerism",
        "Hybrid Soul",
        "Mythic Physiology",
        "Alien Physiology",
        "Angel Physiology",
        "Bakeneko Physiology",
        "Demon Physiology",
        "Elf Physiology",
        "Fairy Physiology",
        "Gargoyle Physiology",
        "Genie Physiology",
        "Ghost Physiology",
        "Giant Physiology",
        "Gorgon Physiology",
        "Griffin Physiology",
        "Grim Reaper Physiology",
        "Hellhound Physiology",
        "Kitsune Physiology",
        "Merfolk Physiology",
        "Minotaur Physiology",
        "Monster Physiology",
        "Naga Physiology",
        "Nephilim Physiology",
        "Oni Physiology",
        "Pegasus Physiology",
        "Phoenix Physiology",
        "Raiju Physiology",
        "Sasquatch Physiology",
        "Spirit Physiology",
        "Succubus Physiology",
        "Tengu Physiology",
        "Thunderbird Physiology",
        "Troll Physiology",
        "Undead Physiology",
        "Unicorn Physiology",
        "Vampire Physiology",
        "Wendigo Physiology",
        "Werewolf Physiology",
        "Plant Mimicry",
        "Flower Mimicry",
        "Fungal Mimicry",
        "Wood Mimicry",
        "Unicellular Mimicry",
        "Transcendent Physiology",
        "Cosmic Entity Physiology",
        "Cthulhu Mythos Deity Physiology",
        "Mythic Physiology",
        "Aboriginal Deity Physiology",
        "African Deity Physiology",
        "Altaic Deity Physiology",
        "Arab Deity Physiology",
        "Armenian Deity Physiology",
        "Aztec Deity Physiology",
        "Canaanite Deity Physiology",
        "Celtic Deity Physiology",
        "Chinese Deity Physiology",
        "Egyptian Deity Physiology",
        "Finnish Deity Physiology",
        "Greek Deity Physiology",
        "Protogenoi Physiology",
        "Titan Physiology",
        "Guarani Deity Physiology",
        "Hindu Deity Physiology",
        "Inca Deity Physiology",
        "Mayan Deity Physiology",
        "Mesopotamian Deity Physiology",
        "Native American Deity Physiology",
        "Norse Deity Physiology",
        "Oceanic Deity Physiology",
        "Orisha Physiology",
        "Philippine Deity Physiology",
        "Roman Deity Physiology",
        "Shinto Deity Physiology",
        "Siberian Deity Physiology",
        "Slavic Deity Physiology",
        "Vodou Deity Physiology",
        "Zoroastrian Deity Physiology"];

    string[] private levels = [
        "of Basic Level",
        "of Advanced Level",
        "of Expert Level",
        "of Master Level",
        "of Ultimate Level",
        "of Absolute Level"
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
    
    function getSupernaturalPhysicalSkills(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "supernaturalPhysicalSkills", supernaturalPhysicalSkills);
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
        if (greatness > 2000) {
            output = string(abi.encodePacked(output, sourceArray[rand % sourceArray.length]));
            if (greatness > 9990) {
                output = string(abi.encodePacked(output, " ", levels[5]));
            } else if (greatness > 9900) {
                output = string(abi.encodePacked(output, " ", levels[4]));
            } else if (greatness > 8900) {
                output = string(abi.encodePacked(output, " ", levels[3]));
            } else if (greatness > 7500) {
                output = string(abi.encodePacked(output, " ", levels[2]));
            } else if (greatness > 6000) {
                output = string(abi.encodePacked(output, " ", levels[1]));
            } else if (greatness > 3000) {
                output = string(abi.encodePacked(output, " ", levels[0]));
            }
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
            } else if (_stringEquals(svgImageTemplate[i], "{{supernaturalPhysicalSkills}}")) {
                part = getSupernaturalPhysicalSkills(tokenId);
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
        '<text x="10" y="20" class="base">',
        '{{vision}}',
        '</text>'
        '<text x="10" y="40" class="base">',
        '{{mentalityBasedPower}}',
        '</text>'
        '<text x="10" y="60" class="base">',
        '{{personalPhysicalPower}}',
        '</text>'
        '<text x="10" y="80" class="base">',
        '{{emission}}',
        '</text>'
        '<text x="10" y="100" class="base">',
        '{{adaptation}}',
        '</text>'
        '<text x="10" y="120" class="base">',
        '{{enhancedPhysicalSkills}}',
        '</text>'
        '<text x="10" y="140" class="base">',
        '{{supernaturalPhysicalSkills}}',
        '</text>'
        '<text x="10" y="160" class="base">',
        '{{realityManipulation}}',
        '</text>'
        '<text x="10" y="180" class="base">',
        '{{travel}}',
        '</text>'
        '<text x="10" y="200" class="base">',
        '{{elementMimicry}}',
        '</text>'
        '<text x="10" y="220" class="base">',
        '{{organicMimicry}}',
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
