pragma solidity ^0.4.15;

import "./BurnableToken.sol";
import "./Ownable.sol";

/**
 * @title Cedex
 * @dev Burnable Token, which can be irreversibly destroyed, ERC20 Token, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `StandardToken` functions.
 */
contract Cedex is BurnableToken, Ownable {

	string public constant name = "CEDEX";
	string public constant symbol = "CEDEX";
	uint8 public constant decimals = 18;
	uint256 public constant INITIAL_SUPPLY = 100000000 * 10**18;

  mapping(address => uint) public transferAllowedDates;

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  function Cedex() {
  	totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    Transfer(0x0, msg.sender, INITIAL_SUPPLY);
  }

  function transfer(address _to, uint _value) returns (bool) {
    require(now > transferAllowedDates[msg.sender]);
    return super.transfer(_to, _value);
  }
  
  function transferFrom(address _from, address _to, uint256 _value) returns (bool) {
    require(now > transferAllowedDates[_from]);
    return super.transferFrom(_from, _to, _value);
  }

  function distributeToken(address _to, uint _value, uint _transferAllowedDate) onlyOwner {
    transferAllowedDates[_to] = _transferAllowedDate;
    super.transfer(_to, _value);
  }

}