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
        require(_deadline > block.timestamp);
        name = _name;
        rate = _rate;
        deadline = _deadline;
        token = new FishToken(_deadline);
    }

    //Deposit
    function () public payable onlyWhileOpen {
        require(msg.value > 0);
        uint256 rewardTokens = rate.mul(msg.value);
        require(iFishToken(token).issueTokens(msg.sender, rewardTokens));
    }

    //Withdraw
    function withdraw() public onlyWhileClosed returns (bool success) {
        if(iFishToken(token).isShark(msg.sender)) {
            msg.sender.transfer(address(this).balance);

            emit Withdraw(msg.sender, address(this));
            return true;
        }
        return false;
    }

    function getWeiCollected() external view returns (uint256 weiCollected) {
        return address(this).balance;
    }
}
