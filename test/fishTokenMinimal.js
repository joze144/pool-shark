const FishToken = artifacts.require("./FishToken.sol")

const timePeriodInSeconds = 3600
let from = Math.floor(new Date() / 1000)
const to = from + timePeriodInSeconds

contract('FishToken', async (accounts) => {
  const owner = accounts[0]

  let instance
  beforeEach('setup contract for each test', async () => {
    instance = await FishToken.new(to)
  })

  it('Owner is shark', async () => {
    const currentShark = await instance.currentShark()
    assert.equal(currentShark, owner)
  })
})
