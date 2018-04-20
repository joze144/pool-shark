pragma solidity ^0.4.21;

import "./SafeMath.sol";
import "./Pool.sol";

contract TimeMockedPool is Pool {
    using SafeMath for uint256;

    function leapForwardInTime(uint256 _seconds) public returns (bool success) {
        deadline = deadline.sub(_seconds);
        return true;
    }

    function TimeMockedPool(string _name, uint256 _rate, uint256 _deadline) Pool(_name, _rate, _deadline) public {}
}
