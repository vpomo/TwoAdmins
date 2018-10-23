const TwoAdmins = artifacts.require('./TwoAdmins.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner =  "0xcFCD7D69b7955548EDB03C0918B8724DFcF2CF83";

    deployer.deploy(TwoAdmins, owner);
};
