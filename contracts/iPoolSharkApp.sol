pragma solidity ^0.4.21;

contract iPoolSharkApp {
    function createPool(string _name, uint256 _rate, uint256 _deadline) external returns (bool success);

    event LogPoolCreated(address indexed _pool, address indexed _creator, string _name, uint256 _rate, uint256 _deadline);
}
