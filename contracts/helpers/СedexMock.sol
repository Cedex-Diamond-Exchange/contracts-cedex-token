pragma solidity ^0.4.15;

import '../../contracts/Cedex.sol';

contract CedexMock is Cedex {

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  function Cedex(address initialAccount, uint256 initialBalance) {
    balances[initialAccount] = initialBalance;
    totalSupply = initialBalance;
  }

}