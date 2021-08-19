// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./IWithFoundation.sol";

abstract contract WithFoundation is IWithFoundation {
    address payable private _foundation;

    constructor(address payable foundation_) {
        _foundation = foundation_;
    }

    function _getFoundationAddress() internal view virtual override returns (address payable) {
        return _foundation;
    }
}
