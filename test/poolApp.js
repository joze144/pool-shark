const PoolSharkApp = artifacts.require("./PoolSharkApp.sol")

contract("PoolSharkApp", async (accounts) => {
  const owner = accounts[0]

  // Initiate instance before each test
  let instance
  beforeEach('setup contract for each test', async () => {
    instance = await PoolSharkApp.new()
  })

  it("Should have owner", async () => {
    const contractOwner = await instance.owner.call({from: owner})
    assert.equal(contractOwner, owner)
  })

  it("Should create Pool", async () => {
    const rate = 100
    const name = 'test pool'
    const deadline = 1523931855

    await instance.createPool(name, rate, deadline, {from: owner})

    const pools = await instance.getPools.call({from: owner})
    assert.equal(pools.length, 1)
  })
})