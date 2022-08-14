// SPDX-License-Identifier: MIT
pragma solidity >=0.6.3 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/RDAO.sol";

contract TestAddMembers {
  address testAddr1 = address(0xCADC7606c2D69f09d3A5171Ab06ef00e4A011c23);
  address testAddr2 = address(0x63994F91c5B07e01a42b533B87A28D509C82520F);

  function testAddMember() public {
    RDAO uut = RDAO(DeployedAddresses.RDAO());

    uut.addMemberDebug(address(this));
    uut.addMemberDebug(testAddr1);

    Assert.equal(uut.isMember(testAddr1), true, "The member should be added to the member list.");
    Assert.equal(uut.isMember(testAddr2), false, "A member which was not added should not be added to the member list.");
  }
}
