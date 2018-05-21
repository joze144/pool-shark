pragma solidity ^0.4.21;

contract iPool {
    function () public payable;

    function withdraw() public returns (bool success);

    function getWeiCollected() external view returns (uint256 weiCollected);

    event Withdraw(address indexed _caller, address indexed _pool);
}
