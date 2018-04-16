const Pool = artifacts.require("./Pool.sol")
const FishToken = require('../build/contracts/FishToken.json')

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

const name = 'test'
const rate = 100
const deadline = 1523931855  // has to be higher than current epoch seconds

contract('FishToken', async (accounts) => {
  const owner = accounts[0]
  const user1 = accounts[1]
  const user2 = accounts[2]

  let instance
  let token
  beforeEach('setup contract for each test', async () => {
    instance = await Pool.new(name, rate, deadline)
    token = await instance.token.call({from:owner})
  })

  it("Name should be test", async () => {
    const name = await instance.name.call({from: owner})
    assert.equal(name, "test")
    console.log("Token contract: " + token)
  })

  it("Should receive deposit and issue tokens", async () => {
    const ethSent = 1
    const balanceOwnerBefore = await web3.eth.getBalance(owner)
    console.log("Owner balance before: " + balanceOwnerBefore)
    const transaction = await instance.send(1)
    const balanceOwnerAfter = await web3.eth.getBalance(owner)
    console.log("Owner balance after: " + balanceOwnerAfter)

    const fishContract = new web3.eth.Contract(FishToken.abi, token)
    const tokenBalance = await fishContract.methods.balanceOf(owner).call({from: owner})
    console.log(JSON.stringify(tokenBalance))
    assert.equal(tokenBalance, (ethSent*rate).toString())
  })
})
