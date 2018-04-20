pragma solidity ^0.4.21;

import "./SafeMath.sol";
import "./Ownable.sol";
import "./Timed.sol";
import "./iFishToken.sol";

contract FishToken is iFishToken, Ownable, Timed {
    using SafeMath for uint256;

    uint8 public decimals;                //How many decimals to show
    address public currentShark;
    uint256 public totalSupply;
    mapping(address => uint256) public balances;

    mapping(address => bool) public participantsMap;
    address[] public participantsArray;

    function FishToken(uint256 _deadline) public {
        require(_deadline > block.timestamp);
        deadline = _deadline;
        totalSupply = 0;
        currentShark = msg.sender;
        owner = msg.sender;
    }

    function determineNewShark() internal {
        address shark = participantsArray[0];
        uint arrayLength = participantsArray.length;
        for (uint i=1; i < arrayLength; i++) {
            if (balances[shark] < balances[participantsArray[i]]) {
                shark = participantsArray[i];
            }
        }

        if(currentShark != shark) {
            currentShark = shark;
            emit LogNewShark(shark, balances[shark]);
        }
    }

    function addToParticipants(address _address) internal returns (bool success) {
        if(participantsMap[_address]) {
            return false;
        }
        participantsMap[_address] = true;
        participantsArray.push(_address);
        return true;
    }

    function transfer(address _to, uint256 _value) public onlyWhileOpen returns (bool success) {
        if (balances[msg.sender] < _value || balances[_to] + _value <= balances[_to]) {
            return false;
        }
        addToParticipants(_to);
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);

        emit LogTransfer(msg.sender, _to, _value);

        determineNewShark();

        return true;
    }

    function issueTokens(address _beneficiary, uint256 _amount) public onlyOwner onlyWhileOpen returns (bool success) {
        if(balances[_beneficiary] + _amount <= balances[_beneficiary]) {
            return false;
        }
        addToParticipants(_beneficiary);
        balances[_beneficiary] = _amount.add(balances[_beneficiary]);
        totalSupply = _amount.add(totalSupply);

        emit LogIssue(_beneficiary, _amount);

        determineNewShark();

        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function isShark(address _address) public view returns (bool success) {
        if (currentShark == _address) {
            return true;
        }
        return false;
    }

    function getShark() public view returns (address sharkAddress, uint256 sharkBalance) {
        return (currentShark, balances[currentShark]);
    }
}
