// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

abstract contract Foundation is PaymentSplitter {
    event ERC20PaymentReleased(address to, uint256 amount, address currency);

    mapping(address => uint256) private _totalReleasedERC20;
    mapping(address => mapping(address => uint256)) private _releasedERC20;

    modifier validERC20(address currency) {
        if (ERC165Checker.supportsERC165(currency)) {
            require(ERC165Checker.supportsInterface(currency, type(IERC20).interfaceId), "not a valid ERC20");
        } else {
            require(IERC20(currency).totalSupply() >= 0, "not a valid ERC20");
        }
        _;
    }

    constructor(address[] memory payees, uint256[] memory shares) PaymentSplitter(payees, shares) {}

    /**
     * @dev Getter for the total amount of ERC20 already released.
     */
    function totalReleasedERC20(address currency) public view validERC20(currency) returns (uint256) {
        return _totalReleasedERC20[currency];
    }

    /**
     * @dev Getter for the amount of ERC20 already released to a payee.
     */
    function releasedERC20(address account, address currency) public view validERC20(currency) returns (uint256) {
        return _releasedERC20[account][currency];
    }

    function releaseERC20(address payable account, address currency) public validERC20(currency) {
        require(super.shares(account) > 0, "Account has no shares");

        IERC20 tokenContract = IERC20(currency);

        uint256 totalReceived = tokenContract.balanceOf(address(this)) + _totalReleasedERC20[currency];
        uint256 payment = (totalReceived * super.shares(account)) /
            super.totalShares() -
            _releasedERC20[account][currency];

        require(payment > 0, "Account is not due payment");

        bool approval = tokenContract.approve(address(this), payment);
        require(approval, "ERC20 does not approve the payment");
        bool success = tokenContract.transferFrom(address(this), account, payment);
        require(success, "ERC20 transfer is not successful");

        _releasedERC20[account][currency] += payment;
        _totalReleasedERC20[currency] += payment;

        emit ERC20PaymentReleased(account, payment, currency);
    }
}
