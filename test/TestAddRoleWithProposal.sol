// SPDX-License-Identifier: MIT
pragma solidity >=0.6.3 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/RDAO.sol";

contract TestAddRoleWithProposal {
  address testAddr1 = address(0xCADC7606c2D69f09d3A5171Ab06ef00e4A011c23);
  address testAddr2 = address(0x63994F91c5B07e01a42b533B87A28D509C82520F);

  function testAddRole() public {
    RDAO uut = RDAO(DeployedAddresses.RDAO());

    uut.addMemberDebug(address(this));

    uint roleHash = uint(keccak256(abi.encodePacked("Boss role")));

    // Create the role to test if we can add it after
    uint msgHash = uint(keccak256(abi.encodePacked("Create the boss role")));
    RDAO.ProposalUrgency urgency = RDAO.ProposalUrgency.HIGH;
    RDAO.ActionType[] memory actions = new RDAO.ActionType[](1);
    actions[0] = RDAO.ActionType.CREATE_ROLE;
    bytes[] memory parameters = new bytes[](1);
    parameters[0] = abi.encode(roleHash, 1, 0xFFFF);

    uint256 votingId = uut.proposeWithRole(msgHash,0, urgency, actions, parameters);
    uut.vote(votingId, RDAO.VoteType.YES);

    msgHash = uint(keccak256(abi.encodePacked("Give me the boss role")));
    actions = new RDAO.ActionType[](1);
    actions[0] = RDAO.ActionType.ADD_ROLE;
    parameters = new bytes[](1);
    parameters[0] = abi.encode(address(this), roleHash);

    votingId = uut.proposeWithRole(msgHash,0, urgency, actions, parameters);

    Assert.equal(uut.hasRole(address(this), roleHash), false, "Member should not have role yet.");

    uut.vote(votingId, RDAO.VoteType.YES);

    Assert.equal(uut.hasRole(address(this), roleHash), true, "Member should role now.");
  }
}
