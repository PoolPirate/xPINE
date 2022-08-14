// SPDX-License-Identifier: MIT
pragma solidity >=0.6.3 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/RDAO.sol";

contract TestPayout {
  address testAddr1 = address(0xCADC7606c2D69f09d3A5171Ab06ef00e4A011c23);
  address testAddr2 = address(0x63994F91c5B07e01a42b533B87A28D509C82520F);
  address testAddr3 = address(0x4A1954Cf428B01f5496c639f1b13A3a5D5e9e68B);
  address testAddr4 = address(0x1256525ff69afbA5cF0448e202641c469d2aDEDA);

  function testPayout() public {
    RDAO uut = RDAO(DeployedAddresses.RDAO());

    uut.addMemberDebug(address(this));

    uint msgHash = uint(keccak256(abi.encodePacked("Money please")));
    RDAO.ProposalUrgency urgency = RDAO.ProposalUrgency.HIGH;
    RDAO.ActionType[] memory actions = new RDAO.ActionType[](1);
    actions[0] = RDAO.ActionType.CHANGE_PAYOUT;

    bytes[] memory parameters = new bytes[](1);
    // 1 ETH per month
    parameters[0] = abi.encode(address(this), address(this), 385802469136);

    uint votingId = uut.proposeWithRole(msgHash, 0, urgency, actions, parameters);

    uint256[] memory votings = uut.getVotings();

    uut.vote(votingId, RDAO.VoteType.YES);

    votings = uut.getVotings();
    Assert.equal(votings.length, 0, "Wrong voting count");

    // We cannot test payouts here because time needs to pass before the member can be payed out
    // uut.payout(address(this), 0, block.timestamp);
  }
}
