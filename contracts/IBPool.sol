//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBPool {
    function getSpotPrice(address tokenIn, address tokenOut) external view returns (uint spotPrice);
}