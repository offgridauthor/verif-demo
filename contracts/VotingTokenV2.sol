// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './VotingTokenX.sol';

contract VotingTokenV2 is VotingTokenX {

  function getVersion() public pure returns(uint256) {
    return 2;
  }
}
