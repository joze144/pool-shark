const FishToken = artifacts.require("./FishToken.sol");
const Web3 = require('web3')
const web3 = new Web3()

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

    const toTransfer = 600
    await instance.transfer(user1, toTransfer, {from: owner})
    assert.equal(await instance.currentShark(), user1)
    const balanceOwner = await instance.balanceOf(owner, {from: owner})
    const balanceUser1 = await instance.balanceOf(user1, {from: owner})
    assert.equal(balanceOwner, (toIssue - toTransfer).toString())
    assert.equal(balanceUser1, toTransfer.toString())
  })
})
