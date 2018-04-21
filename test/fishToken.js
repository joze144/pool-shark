const FishToken = artifacts.require("./FishToken.sol");
const FishTokenTimed = artifacts.require("./TimeMockedFishToken.sol");

const BigNumber = web3.BigNumber;
const maxNumber = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

const timePeriodInSeconds = 3600
const from = Math.floor(new Date() / 1000)
const to = from + timePeriodInSeconds

contract('FishToken', async (accounts) => {
  const owner = accounts[0]
  const user1 = accounts[1]
  const user2 = accounts[2]

  describe("Fish token before deadline", async () => {
    let instance
    beforeEach('setup contract for each test', async () => {
      instance = await FishToken.new(to, {from: owner, gas: 1500000})
    })

    it('Owner has balance', async () => {
      await assertBalanceEqual(owner, 0, instance)
      await assertOwnerEqual(owner, instance)
      await assertSharkEqual(owner, instance)
      await assertDeadlineEqual(to, instance)
      await assertTotalSupplyEqual(0, instance)
    })

    it('Check if address is shark', async () => {
      const toIssue = 100
      const isSharkOwner = await instance.isShark(owner)
      assert.equal(isSharkOwner, true)
      const isSharkUser1 = await instance.isShark(user1)
      assert.equal(isSharkUser1, false)
      await assertIssueTokens(user1, toIssue, owner, instance)
      const isSharkUser1AfterIssue = await instance.isShark(user1)
      assert.equal(isSharkUser1AfterIssue, true)
      const shark = await instance.getShark()
      assert.equal(shark[0], user1)
      assert.equal(shark[1].toString(), toIssue.toString())
    })

    it('Should issue tokens, owner call', async () => {
      const toIssue = 1000
      await assertIssueTokens(user1, toIssue, owner, instance)
      await assertSharkEqual(user1, instance)
    })

    it('Should make transfers and assign shark', async() => {
      const toIssue = 1000
      await assertIssueTokens(owner, toIssue, owner, instance)

      const transfer1 = 600
      await assertTransfer(owner, user1, transfer1, instance)
      await assertSharkEqual(user1, instance)

      const transfer2 = 200
      await assertTransfer(user1, owner, transfer2, instance)
      await assertSharkEqual(owner, instance)

      const transfer3 = 50
      await assertTransfer(owner, user1, transfer3, instance)
      await assertSharkEqual(owner, instance)

      const transfer4 = 500
      await assertTransfer(owner, user2, transfer4, instance)
      await assertSharkEqual(user2, instance)
    })

    it('Should fail transfer, not enough balance', async () => {
      const toIssue = 500
      const toTransfer = 600
      await assertIssueTokens(owner, toIssue, owner, instance)

      try {
        await assertTransfer(owner, user1, toTransfer, instance)
        assert.equal(true,false)
      } catch(err) {
        assert.equal(true, true)
      }
    })

    it('Should fail issue, wrong owner', async () => {
      const toIssue = 500
      try {
        await assertIssueTokens(owner, toIssue, user1, instance)
        assert.equal(true, false)
      } catch (err) {
        assert.equal(true, true)
      }
    })
  })

  describe("Visibility tests", async () => {
    let instance
    beforeEach('setup contract for each test', async () => {
      instance = await FishToken.new(to)
    })

    it("Add to participants should be restricted", async () => {
      try {
        await instance.addToParticipants(user1)
        assert.equal(true, false)
      } catch (err) {
        assert.equal(true, true)
      }
    })

    it("Issue tokens should be restricted for not owner", async () => {
      try {
        await assertIssueTokens(user1, 100, user1, instance)
        assert.equal(true, false)
      } catch (err) {
        assert.equal(true, true)
      }
    })
  })

  describe("Overflow test", async () => {
    let instance
    beforeEach('setup contract for each test', async () => {
      instance = await FishToken.new(to)
    })

    it("Issue overflow", async () => {
      await assertIssueTokens(user1, maxNumber, owner, instance)
      try {
        await assertIssueTokens(user2, maxNumber, owner, instance)
        assert.equal(true, false)
      } catch (err) {
        assert.equal(true, true)
      }
    })
  })

  describe("Time altered tests", async () => {
    let instance
    beforeEach('setup contract for each test', async () => {
      instance = await FishTokenTimed.new(to)
    })

    it("Should change time of the instance", async () => {
      const deadline = await instance.deadline()
      assert.equal(deadline.toString(), to.toString())
      await instance.leapForwardInTime(timePeriodInSeconds)
      const newDeadline = await instance.deadline()
      assert.equal(newDeadline.toString(), from.toString())
    })

    it("Should reject token issuing, time passed", async () => {
      const toIssue = 1000
      await instance.leapForwardInTime(timePeriodInSeconds)
      try {
        await assertIssueTokens(user1, toIssue, owner, instance)
        assert.equal(true, false)
      } catch (err) {
        assert.equal(true, true)
      }
    })

    it("Should reject transaction, time passed", async () => {
      const toIssue = 1000
      await assertIssueTokens(owner, toIssue, owner, instance)
      await instance.leapForwardInTime(timePeriodInSeconds)
      try {
        await assertTransfer(owner, user1, toIssue, instance)
        assert.equal(true, false)
      } catch (err) {
        assert.equal(true, true)
      }
    })
  })
})

async function assertTransfer(from, to, amount, instance) {
  const fromBalanceBefore = await instance.balanceOf(from)
  const toBalanceBefore = await instance.balanceOf(to)
  await instance.transfer(to, amount, {from: from})
  const fromBalanceAfter = await instance.balanceOf(from)
  const toBalanceAfter = await instance.balanceOf(to)

  let fromShouldBe = new BigNumber(fromBalanceBefore)
  fromShouldBe = fromShouldBe.sub(amount.toString())
  let toShouldBe = new BigNumber(toBalanceBefore)
  toShouldBe =  toShouldBe.add(amount.toString())

  assert.equal(fromBalanceAfter.toString(), fromShouldBe.toString())
  assert.equal(toBalanceAfter.toString(), toShouldBe.toString())
}

async function assertIssueTokens(to, amount, owner, instance) {
  const balanceToBefore = await instance.balanceOf(to)
  const totalSupplyBefore = await instance.totalSupply()
  await instance.issueTokens(to, amount, {from: owner})

  const balanceToAfter = await instance.balanceOf(to)
  const totalSupplyAfter = await instance.totalSupply()

  let balanceToShouldBe = new BigNumber(balanceToBefore)
  balanceToShouldBe = balanceToShouldBe.add(amount.toString())
  let totalSupplyShouldBe = new BigNumber(totalSupplyBefore)
  totalSupplyShouldBe = totalSupplyShouldBe.add(amount.toString())

  assert.equal(balanceToAfter, balanceToShouldBe.toString())
  assert.equal(totalSupplyAfter, totalSupplyShouldBe.toString())
}

async function assertBalanceEqual(user, balanceShouldBe, instance) {
  const actualBalance = await instance.balanceOf.call(user, {from: user})
  assert.equal(actualBalance, balanceShouldBe.toString())
}

async function assertSharkEqual(user, instance) {
  assert.equal(await instance.currentShark(), user)
}

async function assertOwnerEqual(owner, instance) {
  assert.equal(await instance.owner(), owner)
}

async function assertDeadlineEqual(deadline, instance) {
  const actual = await instance.deadline()
  assert.equal(actual.toString(), deadline.toString())
}

async function assertTotalSupplyEqual(totalSupply, instance) {
  const actual = await instance.totalSupply()
  assert.equal(actual.toString(), totalSupply.toString())
}
