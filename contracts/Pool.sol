pragma solidity ^0.4.21;

import "./SafeMath.sol";
import "./iPool.sol";
import "./FishToken.sol";

contract Pool is iPool {
    using SafeMath for uint256;

    uint256 public totalAmount;
    uint256 public deadline;
    address public token;

    function Pool(uint256 _deadline) {
        totalAmount = 0;
        deadline = _deadline;
        new FishToken(_deadline);
    }

    //Deposit
    function () payable {

    }

    //Withdraw
    function withdraw() external returns (bool success) {

    }
}
