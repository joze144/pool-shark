pragma solidity ^0.4.21;

import "./SafeMath.sol";
import "./Timed.sol";
import "./iPool.sol";
import "./FishToken.sol";
import "./iFishToken.sol";

contract Pool is iPool, Timed {
    using SafeMath for uint256;

    address public token;
    uint256 public rate;

    function Pool(string _name, uint256 _rate, uint256 _deadline) {
        totalAmount = 0;
        rate = _rate;
        deadline = _deadline;
        token = new FishToken(_name, _deadline);
    }

    //Deposit
    function () payable onlyWhileOpen {
        iFishToken(token).issue(msg.sender, msg.value);
    }

    //Withdraw
    function withdraw() external onlyWhileClosed returns (bool success) {
        if(iFishToken(token).isShark(msg.sender)) {
//           TODO: send transaction. msg.sender
        }
    }

    function getToken() external view returns (address tokenAddress) {
        return token;
    }
}
