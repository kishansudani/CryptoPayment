const PaymentContract = artifacts.require("PaymentContract");
const paymentTokenAddress = "0xC9a66EB35B359816EBeE3763e52ed6250EBC9ddF";

module.exports = function (deployer, network, addresses) {
  if (network === "development") {
    deployer.deploy(PaymentContract, paymentTokenAddress);
  } else if (network === "bsctestnet") {
    deployer.deploy(PaymentContract, paymentTokenAddress);
  }
};
