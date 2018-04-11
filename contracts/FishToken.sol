pragma solidity ^0.4.21;

import "./SafeMath.sol";
import "./iFishToken.sol";

contract FishToken is iFishToken {
    using SafeMath for uint256;

    Shark public currentShark;

    function FishToken(){

    }

    function transfer(address to, uint256 amount) public returns (bool success) {

    }

    function issue(address _beneficiary, uint256 amount) public returns (bool success) {

    }

    function getShark() public returns (Shark shark) {

    }
}
