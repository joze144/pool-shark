const FishToken = artifacts.require("./FishToken.sol");

contract('FishToken', async (accounts) => {
  const owner = accounts[0]
  const user1 = accounts[1]
  const user2 = accounts[2]

  let instance
  beforeEach('setup contract for each test', async function () {
    instance = await FishToken.new(owner)
  })

  it('Owner has balance', async function() {
    const balance = await instance.balanceOf.call(owner, {from: owner})
    assert.equal(balance.toString(), '0')
  })

  it('Has an owner', async function () {
    assert.equal(await instance.owner(), owner)
  })

  it('Total token should be 0.', async () => {
    assert.equal(await instance.totalSupply(), 0)
  })

  it('Current shark should be owner', async () => {
    assert.equal(await instance.currentShark(), owner)
  })

  it('Should issue tokens, owner call', async () => {
    const toIssue = 1000
    await instance.issueTokens(user1, toIssue, {from: owner})
    const totalSupply = await instance.totalSupply()

    assert.equal(totalSupply, toIssue.toString())
  })

  it('Should make transfer', async() => {
    const toIssue = 1000
    await instance.issueTokens(owner, toIssue, {from: owner})
    assert.equal(await instance.currentShark(), owner)

    const transfer1 = 600
    await instance.transfer(user1, transfer1, {from: owner})
    assert.equal(await instance.currentShark(), user1)
    const t1balanceOwner = await instance.balanceOf(owner, {from: owner})
    const t1balanceUser1 = await instance.balanceOf(user1, {from: owner})
    assert.equal(t1balanceOwner, (toIssue - transfer1).toString())
    assert.equal(t1balanceUser1, transfer1.toString())

    const transfer2 = 200
    await instance.transfer(owner, transfer2, {from: user1})
    assert.equal(await instance.currentShark(), owner)
    const t2balanceOwner = await instance.balanceOf(owner, {from: owner})
    const t2balanceUser1 = await instance.balanceOf(user1, {from: owner})
    assert.equal(t2balanceOwner, (t1balanceOwner + transfer2).toString())
    assert.equal(t2balanceUser1, (t1balanceUser1 - transfer2).toString())

    const transfer3 = 50
    await instance.transfer(user1, transfer3, {from: owner})
    assert.equal(await instance.currentShark(), owner)
    const t3balanceOwner = await instance.balanceOf(owner, {from: owner})
    const t3balanceUser1 = await instance.balanceOf(user1, {from: owner})
    assert.equal(t3balanceOwner, (t2balanceOwner - transfer3).toString())
    assert.equal(t3balanceUser1, (t2balanceUser1 + transfer3).toString())
  })
})
