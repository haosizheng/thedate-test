// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract IWithFoundation {
    function _getFoundationAddress() internal virtual view returns (address payable);
}