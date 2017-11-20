pragma solidity ^0.4.4;

import "./BurnableToken.sol";

/**
 * @title Cedex
 * @dev Burnable Token, which can be irreversibly destroyed, ERC20 Token, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `StandardToken` functions.
 */
contract Cedex is BurnableToken {

	string public constant name = "Cedex";
	string public constant symbol = "CDX";
	uint8 public constant decimals = 18;
	uint256 public constant INITIAL_SUPPLY = 100000000 * 10**18;

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  function TestToken() {
  	totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    Transfer(0x0, msg.sender, INITIAL_SUPPLY);
  }

}