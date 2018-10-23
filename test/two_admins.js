var TwoAdmins = artifacts.require("./TwoAdmins.sol");
//import assertRevert from './helpers/assertRevert';


contract('TwoAdmins', (accounts) => {
    var contract;
    var owner = accounts[0]; // for test

    var rate = Number(204);
    var buyWei = Number(1 * 10**18);
    var rateNew = Number(204);
    var buyWeiNew = 1 * 10**18;

    var fundForSale = 1e30;

    it('should deployed contract', async ()  => {
        assert.equal(undefined, contract);
        contract = await TwoAdmins.deployed();
        assert.notEqual(undefined, contract);
    });

    it('get address contract', async ()  => {
        assert.notEqual(undefined, contract.address);
    });

    it('verification balance owner contract', async ()  => {
        var balanceOwner = await contract.balanceOf(owner);
        assert.equal(fundForSale, Number(balanceOwner));
        await contract.startSale();
    });


    it('verification of receiving Ether', async ()  => {
        var balanceAccountTwoBefore = await contract.balanceOf(accounts[2]);
        var weiRaisedBefore = await contract.weiRaised.call();

        await contract.buyTokens(accounts[2],{from:accounts[2], value:buyWei});

       var balanceAccountTwoAfter = await contract.balanceOf(accounts[2]);
        assert.isTrue(balanceAccountTwoBefore < balanceAccountTwoAfter);
        assert.equal(0, balanceAccountTwoBefore);
        assert.equal(rate*buyWei, balanceAccountTwoAfter);

        var weiRaisedAfter = await contract.weiRaised.call();
        assert.isTrue(weiRaisedBefore < weiRaisedAfter);
        assert.equal(0, weiRaisedBefore);
        assert.equal(buyWei, weiRaisedAfter);

        var balanceAccountThreeBefore = await contract.balanceOf(accounts[3]);
        await contract.buyTokens(accounts[3],{from:accounts[3], value:buyWeiNew});
        var balanceAccountThreeAfter = await contract.balanceOf(accounts[3]);
        assert.isTrue(balanceAccountThreeBefore < balanceAccountThreeAfter);
        assert.equal(0, balanceAccountThreeBefore);
        assert.equal(rateNew*buyWeiNew, balanceAccountThreeAfter);
    });


    it('verification claim tokens', async ()  => {
        var balanceAccountOneBefore = await contract.balanceOf(accounts[1]);
        assert.equal(0, balanceAccountOneBefore);
        await contract.buyTokens(accounts[1],{from:accounts[1], value:buyWei});
        var balanceAccountOneAfter = await contract.balanceOf(accounts[1]);
        //console.log("balanceAccountOneAfter", balanceAccountOneAfter);
        await contract.transfer(contract.address,balanceAccountOneAfter,{from:accounts[1]});
        var balanceContractBefore = await contract.balanceOf(contract.address);
        assert.equal(buyWei*rate, balanceContractBefore);
        //console.log("balanceContractBefore = " + balanceContractBefore);
        var balanceAccountAfter = await contract.balanceOf(accounts[1]);
        assert.equal(0, balanceAccountAfter);
        var balanceOwnerBefore = await contract.balanceOf(owner);
        await contract.claimTokens(contract.address,{from:accounts[0]});
        var balanceContractAfter = await contract.balanceOf(contract.address);
        //console.log("balanceContractAfter = " + balanceContractAfter);
        assert.equal(0, balanceContractAfter);
        var balanceOwnerAfter = await contract.balanceOf(owner);
        //console.log("balanceOwnerBefore = " + Number(balanceOwnerBefore));
        //console.log("balanceOwnerAfter = " + Number(balanceOwnerAfter));
        assert.equal(true, Number(balanceOwnerBefore) < Number(balanceOwnerAfter));
    });

    it('verification burning of tokens', async ()  => {
        var balanceOwnerBefore = await contract.balanceOf(owner);
        var totalSupplyBefore = await contract.totalSupply.call();

        await contract.burnToken(1*10**18);

        var balanceOwnerAfter = await contract.balanceOf(owner);
        var totalSupplyAfter = await contract.totalSupply.call();
        assert.equal(true, Number(balanceOwnerBefore) > Number(balanceOwnerAfter));
        assert.equal(true, Number(totalSupplyBefore) > Number(totalSupplyAfter));
    });
});



