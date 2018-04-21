const Pool = artifacts.require("./Pool.sol")
const TimeMockedPool = artifacts.require("./TimeMockedPool.sol")
const FishToken = require('../build/contracts/FishToken.json')

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))

const BigNumber = web3.BigNumber;
const maxNumber = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

const timePeriodInSeconds = 3600
const from = Math.floor(new Date() / 1000)
const to = from + timePeriodInSeconds

const name = 'test'

contract('Pool', async (accounts) => {
  const owner = accounts[0]
  const user1 = accounts[1]
  const user2 = accounts[2]

  describe("Basic tests", async () => {
    const rate = 100
    let instance
    let token
    beforeEach('setup contract for each test', async () => {
      instance = await Pool.new(name, rate, to)
      token = await instance.token()
    })

    it("Name should be test", async () => {
      const nameOnContract = await instance.name()
      assert.equal(nameOnContract, name)
    })

    it("Should receive deposit and issue tokens", async () => {
      const weiSent = 1
      await instance.send(weiSent)

      const fishContract = new web3.eth.Contract(FishToken.abi, token)
      const tokenBalance = await fishContract.methods.balanceOf(owner).call({from: owner})
      assert.equal(tokenBalance, (weiSent*rate).toString())
    })
  })

  describe("Owerflow test", async () => {
    const rate = maxNumber
    let instance
    let token
    beforeEach('setup contract for each test', async () => {
      instance = await Pool.new(name, rate, to)
      token = await instance.token()
    })

    it("Issue tokens overflow", async () => {
      const weiSent = 1
      await instance.send(weiSent, {from: user1})
      const weiSecond = await instance.getWeiCollected()
      assert.equal(weiSecond.toString(), weiSent.toString())

      try {
        await instance.send(weiSent, {from: user1})
        assert.equal(true, false)
      } catch (err) {
        const weiThird = await instance.getWeiCollected()
        assert.equal(weiThird.toString(), weiSecond.toString())
      }
    })
  })

  describe("Time altered tests", async () => {
    const rate = 100
    let instance
    let token
    beforeEach('setup contract for each test', async () => {
      instance = await TimeMockedPool.new(name, rate, to)
      token = await instance.token()
    })

    it("Time test issue tokens", async () => {

    })

    it("Time test withdraw", async () => {

    })

    it("Test withdraw limited to shark", async () => {

    })
  })
})
