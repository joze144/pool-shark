# Shark pool contracts
Create a pool with deadline in which everyone can add Ethereum. 
With adding Ethereum user gets points, which can be transferred 
to another user or kept by yourself. After deadline tokens 
aren’t transferable anymore, and user with most points wins 
and can withdraw Ethereum funds in the pool. 


### FishToken contract
Represents points awarded for ETH deposit to the pool.
Tokens can be created and transferred until deadline.

Properties:
- Transferable to whitelisted members (until deadline expires)
- Issued on deposit (until deadline expires)
- Transfer event, issue event
- Get current shark


### Pool contract
Is a pool where ETH is being collected. 
It has it's own FishToken contract to keep track of contributions.
Users can contribute ETH until deadline expires.
After deadline expires, shark (winner) can withdraw all ETH funds collected.

Properties:
- Deposit (add to whitelist, create tokens) (until deadline expires)
- Withdraw, only for shark (winner) (after deadline expires)
