pragma solidity ^0.4.15;

import '../../contracts/Cedex.sol';


contract CedexMock is Cedex {

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  function CedexMock(address initialAccount, uint256 initialBalance) {
  	totalSupply = initialBalance;
    balances[initialAccount] = initialBalance;
    Transfer(0x0, initialAccount, initialBalance);
  }

}