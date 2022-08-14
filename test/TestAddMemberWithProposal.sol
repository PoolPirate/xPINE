// SPDX-License-Identifier: MIT
pragma solidity >=0.6.3 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./RDAO.sol";

contract TestAddMemberWithProposal {
  address testAddr1 = address(0xCADC7606c2D69f09d3A5171Ab06ef00e4A011c23);
  address testAddr2 = address(0x63994F91c5B07e01a42b533B87A28D509C82520F);

  function testProposalAndVoting() public {
    RDAO uut = RDAO(DeployedAddresses.RDAO());

    uut.addMemberDebug(address(this));

    uint msgHash = uint(keccak256(abi.encodePacked("Add Peter to the company. He is really smart and sexy.")));
    RDAO.ActionType[] memory actions = new RDAO.ActionType[](1);
    actions[0] = RDAO.ActionType.ADD_MEMBER;
    bytes[] memory parameters = new bytes[](1);
    parameters[0] = abi.encode(testAddr1, 0xba4d6f2f1ec272ae2ced72d706561d55d1672191156204d0021758b5134e6d2d);

    uint256 votingId = uut.proposeWithRole(msgHash, 0, RDAO.ProposalUrgency.HIGH, actions, parameters);

    Assert.equal(uut.getMemberCount(), 2, "Wrong member count.");

    uint256[] memory votings = uut.getVotings();

    Assert.equal(votings.length, 1, "Wrong voting count");
    Assert.equal(votings[0], votingId, "Proposal was changed");

    uut.vote(votingId, RDAO.VoteType.YES);

    votings = uut.getVotings();

    Assert.equal(votings.length, 0, "Wrong voting count");

    Assert.equal(uut.isMember(testAddr1), true, "The member should be added to the member list.");
    Assert.equal(uut.isMember(testAddr2), false, "A member which was not added should not be in the member list.");
    Assert.equal(uut.getMemberCount(), 3, "Wrong member count.");
  }
}
