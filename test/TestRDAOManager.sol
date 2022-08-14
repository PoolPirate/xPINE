// SPDX-License-Identifier: MIT
pragma solidity >=0.6.3 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/RDAO.sol";
import "../contracts/RDAOManager.sol";

contract TestRDAOManager {
  address testAddr1 = address(0xCADC7606c2D69f09d3A5171Ab06ef00e4A011c23);
  address testAddr2 = address(0x63994F91c5B07e01a42b533B87A28D509C82520F);

  function testRDAOManager() public {
    RDAOManager uut = RDAOManager(DeployedAddresses.RDAOManager());
    uut.createRDAO(0xCADC7606c2D69f09d3A5171Ab06ef00e4A011c23, 1, 1, new RDAO.ActionType[](0), new bytes[](0));
  }
}
