pragma solidity ^0.4.21;

contract iFishToken {
    struct Shark {
        address _address;
        uint256 _balance;
    }

    function transfer(address to, uint256 amount) public returns (bool success);

    function issue(address _beneficiary, uint256 amount) public returns (bool success);

    function getShark() public returns (Shark shark);
}
