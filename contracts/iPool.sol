pragma solidity ^0.4.21;

contract iPool {
    function withdraw() external returns (bool success);

    function getToken() external view returns (address tokenAddress);
}
