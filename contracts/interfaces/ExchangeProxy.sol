//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

interface TokenInterface {
    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    function approve(address, uint256) external returns (bool);

    function transfer(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function deposit() external payable;

    function withdraw(uint256) external;
}

interface ExchangeProxy {

    struct Swap {
        address pool;
        address tokenIn;
        address tokenOut;
        uint    swapAmount; // tokenInAmount / tokenOutAmount
        uint    limitReturnAmount; // minAmountOut / maxAmountIn
        uint    maxPrice;
    }

    function batchSwapExactIn(
        Swap[] memory swaps,
        TokenInterface tokenIn,
        TokenInterface tokenOut,
        uint totalAmountIn,
        uint minTotalAmountOut
    )
        external payable
        returns (uint totalAmountOut);

    function batchSwapExactOut(
        Swap[] memory swaps,
        TokenInterface tokenIn,
        TokenInterface tokenOut,
        uint maxTotalAmountIn
    )
        external payable
        returns (uint totalAmountIn);

    function multihopBatchSwapExactIn(
        Swap[][] memory swapSequences,
        TokenInterface tokenIn,
        TokenInterface tokenOut,
        uint totalAmountIn,
        uint minTotalAmountOut
    )
        external payable
        returns (uint totalAmountOut);

    function multihopBatchSwapExactOut(
        Swap[][] memory swapSequences,
        TokenInterface tokenIn,
        TokenInterface tokenOut,
        uint maxTotalAmountIn
    )
        external payable
        returns (uint totalAmountIn);

    function smartSwapExactIn(
        TokenInterface tokenIn,
        TokenInterface tokenOut,
        uint totalAmountIn,
        uint minTotalAmountOut,
        uint nPools
    )
        external payable
        returns (uint totalAmountOut);

    function smartSwapExactOut(
        TokenInterface tokenIn,
        TokenInterface tokenOut,
        uint totalAmountOut,
        uint maxTotalAmountIn,
        uint nPools
    )
        external payable
        returns (uint totalAmountIn);

    function viewSplitExactIn(
        address tokenIn,
        address tokenOut,
        uint swapAmount,
        uint nPools
    )
        external view
        returns (Swap[] memory swaps, uint totalOutput);

    function viewSplitExactOut(
        address tokenIn,
        address tokenOut,
        uint swapAmount,
        uint nPools
    )
        external view
        returns (Swap[] memory swaps, uint totalOutput);
}