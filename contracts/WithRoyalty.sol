// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IERC2981.sol";
import "./IWithFoundation.sol";

abstract contract WithRoyalty is AccessControl, IERC2981, IWithFoundation {
    uint256 private _royaltyPermyriad;
    
    constructor(uint256 royaltyPermyriad_) {
        _royaltyPermyriad = royaltyPermyriad_;
    }

    function setRoyaltyPermyriad(uint256 royaltyPermyriad) public onlyRole(DEFAULT_ADMIN_ROLE) {
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
        return (_getFoundationAddress(), salePrice * _royaltyPermyriad / 10000);
    }

    function supportsInterface(bytes4 interfaceId) 
        public virtual view override(AccessControl, IERC165) returns (bool) 
    {
        return type(IERC2981).interfaceId == interfaceId || AccessControl.supportsInterface(interfaceId);
    }
}