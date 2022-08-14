const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    development: { // default with truffle unbox is 7545, but we can use develop to test changes, ex. truffle migrate --network develop
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      from: "0xDd03569f811A574F6e90769a445a89de07D00ddd"
    },
    fantom: {
      host: "rpcapi.fantom.network",
      network_id: "250",
      from: "0x2D2eD2DE127e0702f9debe0d945450B0FD4635c0",
    }
  },
  // Configure your compilers
  compilers: {
    solc: {
      optimizer: {
        enabled: true
      },
      version: "0.8.13"
    }
  },
};
