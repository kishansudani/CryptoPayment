const ZeroToken = artifacts.require("ZeroToken");

module.exports = function (deployer) {
  deployer.deploy(ZeroToken);
};
