// SPDX-License-Identifier: MIT
pragma solidity >=0.6.3 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/RDAO.sol";

contract TestRemoveMemberWithProposal {
  address testAddr1 = address(0xCADC7606c2D69f09d3A5171Ab06ef00e4A011c23);
  address testAddr2 = address(0x63994F91c5B07e01a42b533B87A28D509C82520F);
  address testAddr3 = address(0x4A1954Cf428B01f5496c639f1b13A3a5D5e9e68B);
  address testAddr4 = address(0x1256525ff69afbA5cF0448e202641c469d2aDEDA);

  function testRemoveMember() public {
    RDAO uut = RDAO(DeployedAddresses.RDAO());

    uut.addMemberDebug(address(this));

    Assert.equal(uut.isMember(address(this)), true, "The address should be a member.");

    uint msgHash = uint(keccak256(abi.encodePacked("Kick me from the company.")));
    RDAO.ProposalUrgency urgency = RDAO.ProposalUrgency.HIGH;
    RDAO.ActionType[] memory actions = new RDAO.ActionType[](1);
    actions[0] = RDAO.ActionType.REMOVE_MEMBER;

    bytes[] memory parameters = new bytes[](1);
    parameters[0] = abi.encode(address(this));

    uint votingId = uut.proposeWithRole(msgHash, 0, urgency, actions, parameters);

    uint256[] memory votings = uut.getVotings();

    Assert.equal(votings.length, 1, "Wrong voting count");
    Assert.equal(votings[0], votingId, "Proposal was changed");

    Assert.equal(uut.isMember(address(this)), true, "The address should still be a member.");

    uut.vote(votingId, RDAO.VoteType.YES);

    votings = uut.getVotings();
    Assert.equal(votings.length, 0, "Wrong voting count");

    Assert.equal(uut.isMember(address(this)), false, "The address should not be a member anymore.");
  }
}
