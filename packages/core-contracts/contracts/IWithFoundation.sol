// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract IWithFoundation {
    function _getFoundationAddress() internal view virtual returns (address payable);
}
