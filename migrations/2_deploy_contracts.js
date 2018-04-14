const Ownable = artifacts.require("./Ownable.sol");
const SafeMath = artifacts.require("./SafeMath.sol");
const Timed = artifacts.require("./Timed.sol");
const iFishToken = artifacts.require("./iFishToken.sol");
const FishToken = artifacts.require("./FishToken.sol");

module.exports = function(deployer) {
  deployer.deploy(FishToken, 1523610792);
};
