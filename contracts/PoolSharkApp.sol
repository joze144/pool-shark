pragma solidity ^0.4.21;

import "./Pool.sol";
import "./Ownable.sol";

contract PoolSharkApp is Ownable {

    address public owner;
    address[] public pools;

    function PoolSharkApp() public {
        owner = msg.sender;
    }

    event LogPoolCreated(address indexed _pool, string _name, uint256 _rate, uint256 _deadline);

    function createPool(string _name, uint256 _rate, uint256 _deadline) external returns (bool success) {
        address newPoolAddress = new Pool(_name, _rate, _deadline);
        pools.push(newPoolAddress);

        emit LogPoolCreated(newPoolAddress, _name, _rate, _deadline);
        return true;
    }

    function getPools() external view returns (address[] _pools) {
        return pools;
    }
}
