const { expectRevert } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");
const { ethers, upgrades } = require("hardhat");

const ERC20 = artifacts.require("ERC20");
const Roter02 = artifacts.require("IUniswapV2Router02");

const Uniswap = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const Balancer = "0x3E66B66Fd1d0b02fDa6C811Da9E0547970DB2f21";

const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const ALBT = "0x00a8b738E453fFd858a7edf03bcCfe20412f0Eb0";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

describe("ToolV1", () => {
  let toolv1;
  let uniswap;
  let amountToBuy;

  let user;
  let recipient;

  before(async () => {
    [user, recipient] = await ethers.getSigners();

    const ToolV1 = await ethers.getContractFactory("ToolV1");
    toolv1 = await upgrades.deployProxy(ToolV1, [
      recipient.address,
      Uniswap,
      Balancer,
    ]);
    await toolv1.deployed();

    uniswap = await Roter02.at(Uniswap);
  });

  it("Should get amount of tokens to buy with 1 ETH", async () => {
    let etherAmount = "1";
    let x = await uniswap.getAmountsOut(web3.utils.toWei(etherAmount), [
      WETH,
      ALBT,
    ]);
    amountToBuy = String(x[1]);
  });

  it("Should not execute with 0 ETH", async () => {
    await expectRevert(
      toolv1.connect(user).makeSwap(ALBT, amountToBuy, { value: 0 }),
      "Not enough ETH"
    );
  });

  it("Should swap only 1 token", async () => {
    let etherAmount = "1";
    const albt = await ERC20.at(ALBT);

    let prevBalance = await albt.balanceOf(user.address);
    let prevBalanceRecipient = await recipient.getBalance();
    await toolv1
      .connect(user)
      .makeSwap(ALBT, amountToBuy, { value: web3.utils.toWei(etherAmount) });
    let postBalance = await albt.balanceOf(user.address);
    let postBalanceRecipient = await recipient.getBalance();

    assert(
      Number(prevBalance) < Number(postBalance) &&
        Number(prevBalanceRecipient) < Number(postBalanceRecipient)
    );
  });

//   it("Should swap several tokens", async () => {
//     let etherAmount = "1";
//     let toToken = [USDC, USDT, UNI, DAI, ALBT];
//     let porcToken = [10, 20, 30, 20, 20];
//     let amounts = [];
//     for (let i = 0; i < toToken.length; i++) {
//       let eth = (parseInt(web3.utils.toWei(etherAmount)) * porcToken[i]) / 100;
//       let x = await uniswap.getAmountsOut(String(eth), [WETH, toToken[i]]);
//       amounts.push(String(x[1]));
//     }
//     const albt = await ERC20.at(ALBT);
//     const usdc = await ERC20.at(USDC);
//     const usdt = await ERC20.at(USDT);
//     const uni = await ERC20.at(UNI);
//     const dai = await ERC20.at(DAI);

//     let prevBalancealbt = await albt.balanceOf(user.address);
//     let prevBalanceusdc = await usdc.balanceOf(user.address);
//     let prevBalanceusdt = await usdt.balanceOf(user.address);
//     let prevBalanceuni = await uni.balanceOf(user.address);
//     let prevBalancedai = await dai.balanceOf(user.address);
//     let prevBalanceRecipient = await recipient.getBalance();

//     await toolv1
//       .connect(user)
//       .makeMultiSwap(toToken, porcToken, amounts, {
//         value: web3.utils.toWei(etherAmount),
//       });

//     let postBalancealbt = await albt.balanceOf(user.address);
//     let postBalanceusdc = await usdc.balanceOf(user.address);
//     let postBalanceusdt = await usdt.balanceOf(user.address);
//     let postBalanceuni = await uni.balanceOf(user.address);
//     let postBalancedai = await dai.balanceOf(user.address);
//     let postBalanceRecipient = await recipient.getBalance();

//     assert(
//       Number(prevBalancealbt) < Number(postBalancealbt) &&
//         Number(prevBalanceusdc) < Number(postBalanceusdc) &&
//         Number(prevBalanceusdt) < Number(postBalanceusdt) &&
//         Number(prevBalanceuni) < Number(postBalanceuni) &&
//         Number(prevBalancedai) < Number(postBalancedai) &&
//         Number(prevBalanceRecipient) < Number(postBalanceRecipient)
//     );
//   });
});
