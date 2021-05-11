/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter");
require('@openzeppelin/hardhat-upgrades');

module.exports = {
  networks: {
    hardhat: {
      // Uncomment these lines to use mainnet fork
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/CBAmci7PYPNk1GNCk0yFsvj2ANlodsqp`,
        blockNumber: 11589707,
      },
    },
    live: {
      url: `https://eth-mainnet.alchemyapi.io/v2/CBAmci7PYPNk1GNCk0yFsvj2ANlodsqp`,
      accounts: ["0x4d8b9861de"],
    },
  },
  etherscan: {
    apiKey: "GUWH4DPB4Y5VH8MT6Q51PMZ597FGN7RK4P",
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 240000,
  },
};
