'use strict';

const assertJump = require('./helpers/assertJump');
var CedexMock = artifacts.require('./helpers/CedexMock.sol');

contract('Cedex', function(accounts) {
  let token;

   const NAME = "Cedex";
   const SYMBOL = "CEDEX";
   const DECIMALS = 18;
   const TOTAL_SUPPLY = 100;

  beforeEach(async function() {
    token = await CedexMock.new(accounts[0], TOTAL_SUPPLY);
  })

  it("name", async function() {
     assert.equal(await token.name.call(), NAME)
  })

  it("symbol", async function() {
     assert.equal(await token.symbol.call(), SYMBOL)
  })

  it("decimals", async function() {
     assert.equal(await token.decimals.call(), DECIMALS)
  })

  it('totalSupply', async function() {
     assert.equal((await token.totalSupply.call()).toNumber(), TOTAL_SUPPLY)
  })

  it('should return the correct allowance amount after approval', async function() {
    await token.approve(accounts[1], 100);
    let allowance = await token.allowance(accounts[0], accounts[1]);

    assert.equal(allowance, 100);
  })

  it('should return correct balances after transfer', async function() {
    await token.transfer(accounts[1], 100);
    let balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0, 0);

    let balance1 = await token.balanceOf(accounts[1]);
    assert.equal(balance1, 100);
  })

  it('should throw an error when trying to transfer more than balance', async function() {
    try {
      await token.transfer(accounts[1], 101);
      assert.fail('should have thrown before');
    } catch(error) {
      assertJump(error);
    }
  })

  it('should return correct balances after transfering from another account', async function() {
    await token.approve(accounts[1], 100);
    await token.transferFrom(accounts[0], accounts[2], 100, {from: accounts[1]});

    let balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0, 0);

    let balance1 = await token.balanceOf(accounts[2]);
    assert.equal(balance1, 100);

    let balance2 = await token.balanceOf(accounts[1]);
    assert.equal(balance2, 0);
  })

  it('should throw an error when trying to transfer more than allowed', async function() {
    await token.approve(accounts[1], 99);
    try {
      await token.transferFrom(accounts[0], accounts[2], 100, {from: accounts[1]});
      assert.fail('should have thrown before');
    } catch (error) {
      assertJump(error);
    }
  })

  it('should throw an error when trying to transferFrom more than _from has', async function() {
    let balance0 = await token.balanceOf(accounts[0]);
    await token.approve(accounts[1], 99);
    try {
      await token.transferFrom(accounts[0], accounts[2], balance0+1, {from: accounts[1]});
      assert.fail('should have thrown before');
    } catch (error) {
      assertJump(error);  
    }
  })


  it('should start with zero', async function() {
    let preApproved = await token.allowance(accounts[0], accounts[1]);
    assert.equal(preApproved, 0);
  })

  it('should increase by 50 then decrease by 10', async function() {
    let preApproved = await token.allowance(accounts[0], accounts[1]);  

    await token.increaseApproval(accounts[1], 50);
    let postIncrease = await token.allowance(accounts[0], accounts[1]);
    assert.equal(preApproved.toNumber() + 50, postIncrease);

    await token.decreaseApproval(accounts[1], 10);
    let postDecrease = await token.allowance(accounts[0], accounts[1]);
    assert.equal(postIncrease - 10, postDecrease);
  })


  it('should increase by 50 then set to 0 when decreasing by more than 50', async function() {
    await token.approve(accounts[1], 50);
    await token.decreaseApproval(accounts[1], 60);
    let postDecrease = await token.allowance(accounts[0], accounts[1]);
    assert.equal(postDecrease, 0)
  })

  it('should throw an error when trying to transfer to 0x0', async function() {
    try {
      let transfer = await token.transfer(0x0, 100);
      assert.fail('should have thrown before');
    } catch(error) {
      assertJump(error);
    }
  })

  it('should throw an error when trying to transferFrom to 0x0', async function() {
    let token = await CedexMock.new(accounts[0], 100);
    await token.approve(accounts[1], 100);
    try {
      let transfer = await token.transferFrom(accounts[0], 0x0, 100, {from: accounts[1]});
      assert.fail('should have thrown before');
    } catch(error) {
      assertJump(error);
    }
  })


  it('owner should be able to burn tokens', async function () {
      let expectedTokenSupply = 99;
      await token.burn(1, { from: accounts[0] });

      let balance = await token.balanceOf(accounts[0])
      assert.equal(balance, expectedTokenSupply);


      let totalSupply = await token.totalSupply()
      assert.equal(totalSupply, expectedTokenSupply);
  })

  it('cannot burn more tokens than your balance', async function () {
    try {
      await token.burn(200, { from: accounts[0] });
      assert.fail('should have thrown before');
    } catch (error) {
      assertJump(error);
    }
  })

})