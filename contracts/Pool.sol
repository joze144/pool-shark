pragma solidity ^0.4.21;

import "./SafeMath.sol";
import "./iPool.sol";

contract Pool is iPool {
    using SafeMath for uint256;

    uint256 public totalAmount;
    uint256 public deadline;

    function Pool(uint256 _deadline) {
        totalAmount = 0;
        deadline = _deadline;
    }

    //Deposit
    function () payable {

    }

    //Withdraw
    function withdraw() external returns (bool success) {

    }
}
