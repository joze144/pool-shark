pragma solidity ^0.4.21;

import "./SafeMath.sol";
import "./FishToken.sol";

contract TimeMockedFishToken is FishToken {
    using SafeMath for uint256;

    function leapForwardInTime(uint256 _seconds) public returns (bool success) {
        if(deadline.sub(_seconds) > deadline){
            return false;
        }
        deadline = deadline.sub(_seconds);
        return true;
    }

    function leapBackInTime(uint256 _seconds) public returns (bool success) {
        if(deadline.add(_seconds) < deadline) {
            return false;
        }
        deadline = deadline.add(_seconds);
        return true;
    }

    function TimeMockedFishToken(uint256 _deadline)  FishToken(_deadline) public { }
}
