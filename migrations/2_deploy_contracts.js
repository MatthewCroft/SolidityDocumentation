var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var SimpleAuction = artifacts.require("SimpleAuction");
var Purchase = artifacts.require("Purchase");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(SimpleAuction, 100000, '0x5124DC241018Ebdf70d6567b5e4948E8A448dFFA');
  deployer.deploy(Purchase, {value: 10000000000000000000 });
};
