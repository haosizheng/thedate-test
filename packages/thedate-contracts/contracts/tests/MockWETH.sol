// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockWETH is ERC20 {

    constructor() ERC20('Wrapped Ether', 'ETH') {}

    function deposit() external payable {
        _mint(msg.sender, msg.value);
    }

    function withdraw(uint amount) external {
        require(balanceOf(msg.sender) >= amount, 'balance too low');
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount);
    }
}
