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
    const t1balanceOwnerShouldBe = toIssue - transfer1
    const t1balanceUser1 = await instance.balanceOf(user1, {from: owner})
    const t1balanceUser1ShouldBe = transfer1
    assert.equal(t1balanceOwner, t1balanceOwnerShouldBe.toString())
    assert.equal(t1balanceUser1, t1balanceUser1ShouldBe.toString())

    const transfer2 = 200
    await instance.transfer(owner, transfer2, {from: user1})
    assert.equal(await instance.currentShark(), owner)
    const t2balanceOwner = await instance.balanceOf(owner, {from: owner})
    const t2balanceOwnerShouldBe = t1balanceOwnerShouldBe + transfer2
    const t2balanceUser1 = await instance.balanceOf(user1, {from: owner})
    const t2balanceUser1ShouldBe = t1balanceUser1ShouldBe - transfer2
    assert.equal(t2balanceOwner, t2balanceOwnerShouldBe.toString())
    assert.equal(t2balanceUser1, t2balanceUser1ShouldBe.toString())

    const transfer3 = 50
    await instance.transfer(user1, transfer3, {from: owner})
    assert.equal(await instance.currentShark(), owner)
    const t3balanceOwner = await instance.balanceOf(owner, {from: owner})
    const t3balanceOwnerShouldBe = t2balanceOwnerShouldBe - transfer3
    const t3balanceUser1 = await instance.balanceOf(user1, {from: owner})
    const t3balanceUser1ShouldBe = t2balanceUser1ShouldBe + transfer3
    assert.equal(t3balanceOwner, t3balanceOwnerShouldBe.toString())
    assert.equal(t3balanceUser1, t3balanceUser1ShouldBe.toString())

    const transfer4 = 500
    await instance.transfer(user2, transfer4, {from: owner})
    assert.equal(await instance.currentShark(), user2)
    const t4balanceOwner = await instance.balanceOf(owner, {from: owner})
    const t4balanceOwnerShouldBe = t3balanceOwnerShouldBe - transfer4
    const t4balanceUser2 = await instance.balanceOf(user2, {from: owner})
    const t4balanceUser2ShouldBe = transfer4
    assert.equal(t4balanceOwner, t4balanceOwnerShouldBe.toString())
    assert.equal(t4balanceUser2, t4balanceUser2ShouldBe.toString())
  })
})
