pragma solidity ^0.4.21;

import "./SafeMath.sol";
import "./Ownable.sol";
import "./Timed.sol";
import "./iFishToken.sol";

contract FishToken is iFishToken, Ownable, Timed {
    using SafeMath for uint256;

    string public name;
    uint8 public decimals;                //How many decimals to show
    address public currentShark;
    uint256 public totalSupply;
    mapping(address => uint256) public balances;

    function FishToken(string _name, uint256 _deadline){
        name = _name;
        deadline = _deadline;
        totalSupply = 0;
        currentShark = Shark(msg.sender, 0);
        owner = msg.sender;
    }

    function determineIfNewShark(address _address) internal returns (bool success) {
        if(currentShark == _address) {
            // Address already a current shark
            return false;
        }
        if (balances[currentShark] >= balances[_address]) {
            // Address balance lower or equal compared to the current shark one
            return false;
        }

        currentShark = _address;
        return true;
    }

    function transfer(address _to, uint256 _value) public onlyWhileOpen returns (bool success) {
        // Assumes totalSupply and initialAmount can't be over max (2^256 - 1)
        if (balances[msg.sender] < _value || balances[_to] + _value <= balances[_to]) {
            return false;
        }
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);

        LogTransfer(msg.sender, _to, _value);

        if(determineIfNewShark(_to)) {
            LogNewShark(_to, balances[_to]);
        }

        return true;
    }

    function issue(address _beneficiary, uint256 _amount) public onlyOwner onlyWhileOpen returns (bool success) {
        balances[_beneficiary] = balances[_beneficiary].add(_amount);
        totalSupply = totalSupply.add(_amount);

        LogIssue(_beneficiary, _amount);

        if(determineIfNewShark(_beneficiary)) {
            LogNewShark(_beneficiary, balances[_beneficiary]);
        }

        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function isShark(address _address) public returns (bool success) {
        if (currentShark._address == _address) {
            return true;
        }
        return false;
    }

    function getShark() public returns (Shark shark) {
        return Shark(currentShark, balances[currentShark]);
    }

    function getName() public view returns (string name) {
        return name;
    }

    function getTotalSupply() public view returns (uint256 totalSupply) {
        return totalSupply;
    }
}
