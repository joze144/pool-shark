pragma solidity ^0.4.21;

contract iFishToken {
    struct Shark {
        address _address;
        uint256 _balance;
    }

    /// @notice Get name of the group
    /// @return Returns group name
    function getName() public view returns (string name);

    /// @return total amount of tokens
    function getTotalSupply() public view returns (uint256 totalSupply);

    /// @param _owner The address from which the balance will be retrieved
    /// @return The balance
    function balanceOf(address _owner) public view returns (uint256 balance);

    function transfer(address _to, uint256 _amount) public returns (bool success);

    function issue(address _beneficiary, uint256 _amount) public returns (bool success);

    function getShark() public returns (Shark shark);

    function isShark() public returns (bool success);

    /// @notice Event propagated on every executed transaction
    event LogTransfer(address indexed _from, address indexed _to, uint256 _value);

    /// @notice Event propagated when new deposit is made to the pool
    event LogIssue(address indexed _member, uint256 _value);

    /// @notice Event propagated when new address has the most tokens
    event LogNewShark(address indexed _shark, uint256 _value);
}
