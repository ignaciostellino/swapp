//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import './ToolV1.sol';

import "hardhat/console.sol";

contract ToolV2 is ToolV1 {

    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    function makeSwapBal(address to, uint amount) payable public{
        require(msg.value > 0, "Not enough ETH");
        uint remaining = msg.value.sub(msg.value.div(1000));

        TokenInterface weth = TokenInterface(uniswapRouter.WETH());
        TokenInterface toToken = TokenInterface(to);
        
        weth.deposit{value: remaining}();
        weth.approve(address(balancer), remaining);
        
        balancer.smartSwapExactOut(weth, toToken, amount, remaining, 3);

        recipient.transfer(msg.value.div(1000));
    }

}