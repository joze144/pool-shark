# Shark of The Pool contracts
Create a pool with deadline in which everyone can add Ether. 
With adding Ether user gets points, which can be transferred 
to another user or kept by yourself. After deadline tokens 
are not transferable anymore, and user with most points wins 
and can withdraw Ethe funds in the pool. 


### FishToken contract
Represents points awarded for ETH deposit to the pool.
Tokens can be created and transferred until deadline.

Properties:
- Transferable (until deadline expires)
- Issued on deposit (until deadline expires)
- Transfer event, issue event
- Get current shark


### Pool contract
Is a pool where Ether is being collected. 
It has it's own FishToken contract to keep track of contributions.
Users can contribute Ether until deadline expires.
After deadline expires, shark (winner) can withdraw all Ether collected.

Properties:
- Deposit (create tokens) (until deadline expires)
- Withdraw, only for shark (winner) (after deadline expires)
