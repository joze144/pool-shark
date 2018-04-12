pragma solidity ^0.4.21;

import "./SafeMath.sol";
import "./Timed.sol";
import "./iPool.sol";
import "./FishToken.sol";
import "./iFishToken.sol";

contract Pool is iPool, Timed {
    using SafeMath for uint256;

    string public name;
    address public token;
    uint256 public rate;

    function Pool(string _name, uint256 _rate, uint256 _deadline) public {
        require(_rate > 0);
        require(_deadline > 0);
        name = _name;
        rate = _rate;
        deadline = _deadline;
        token = new FishToken(_deadline);
    }

    //Deposit
    function () payable onlyWhileOpen public {
        require(msg.value > 0);
        uint256 rewardTokens = rate.mul(msg.value);
        iFishToken(token).issue(msg.sender, rewardTokens);
    }

    //Withdraw
    function withdraw() external onlyWhileClosed returns (bool success) {
        if(iFishToken(token).isShark(msg.sender)) {
           msg.sender.transfer(address(this).balance);
            return true;
        }
        return false;
    }
}
