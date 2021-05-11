const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { ethers, upgrades } = require("hardhat");

const ERC20 = artifacts.require("ERC20");
const Roter02 = artifacts.require("IUniswapV2Router02");
const IBalancer = artifacts.require("ExchangeProxy");
const IBPool = artifacts.require("IBPool");


const Uniswap = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const Balancer = "0x3E66B66Fd1d0b02fDa6C811Da9E0547970DB2f21";

const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

describe("ToolV2", () => {
  let dex;
  let uniswap;
  let balancer;

  let user;
  let recipient;
  
  before(async () => {
    [user, recipient] = await ethers.getSigners();

    const ToolV1 = await ethers.getContractFactory("ToolV1");
    dex = await upgrades.deployProxy(ToolV1, [recipient.address, Uniswap, Balancer]);
    await dex.deployed();
    
    const ToolV2 = await ethers.getContractFactory("ToolV2");
    dex = await upgrades.upgradeProxy(dex.address, ToolV2);
    console.log("dexv2 upgraded", dex.address);

    uniswap = await Roter02.at(Uniswap);
    balancer = await IBalancer.at(Balancer);
  });
  
  it("Should buy USDC with balancer", async () => {
    let etherAmount = 10;

    const erc20 = await ERC20.at(USDC);
    const pools = await balancer.viewSplitExactIn(WETH, USDC, etherAmount, 10);
    let amountToBuy = 0;
    for (const swap of pools.swaps) {
      const pool = await IBPool.at(swap.pool);
      let price = await pool.getSpotPrice(WETH,USDC);
      let amount = etherAmount/(Number(web3.utils.fromWei(price))/10**(18-Number(await erc20.decimals())));
      if(amount > amountToBuy) amountToBuy = amount;
    }
    console.log(`amountToBuy`, amountToBuy)
    
    let prevBalance = Number(await erc20.balanceOf(dex.address));
    console.log(`before`, prevBalance)
    await dex.connect(user).makeSwapBal(USDC, parseInt(amountToBuy), {value: web3.utils.toWei(String(etherAmount))});
    let postBalance = Number(await erc20.balanceOf(dex.address));
    console.log(`after`, postBalance)
    assert(Number(prevBalance) < Number(postBalance));
  })

});