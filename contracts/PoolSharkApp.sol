pragma solidity ^0.4.21;

import "./Pool.sol";
import "./Ownable.sol";
import "./iPoolSharkApp.sol";

contract PoolSharkApp is iPoolSharkApp {

    function PoolSharkApp() public {
    }

    function createPool(string _name, uint256 _rate, uint256 _deadline) external returns (bool success) {
        address newPoolAddress = new Pool(_name, _rate, _deadline);

        emit LogPoolCreated(newPoolAddress, msg.sender, _name, _rate, _deadline);
        return true;
    }
}
