const BlindAuction = artifacts.require("BlindAuction");
const {
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { soliditySha3 } = require("web3-utils")


contract("BlindAuction", (accounts) => {
    let blindAuction;
    let beneficiary;
    let firstBid;
    let secondBidFake;
    let winningBid;
    let highestBidder;

    before(async() => {
        let biddingTime = 10000;
        let revealTime = 10000;
        blindAuction = await BlindAuction.new(biddingTime, revealTime, accounts[0]);
        beneficiary = accounts[0];

        firstBid = await blindAuction.generateBlindedBidBytes32(10, false, web3.utils.asciiToHex('first'))
        secondBidFake = await blindAuction.generateBlindedBidBytes32(20, true, web3.utils.asciiToHex('second'))
        winningBid = await blindAuction.generateBlindedBidBytes32(15, false, web3.utils.asciiToHex('win'))
        highestBidder = accounts[2];
    })
    
    it("bid allows us to place blindedBids", async() => {
        await blindAuction.bid(firstBid, {
            from: accounts[1],
            value: 10
        });

        await blindAuction.bid(secondBidFake, {
            from: accounts[1],
            value: 20
        });

        await blindAuction.bid(winningBid, {
            from: accounts[2],
            value: 15
        });

        let account1Bid1 = await blindAuction.bids.call(accounts[1], 0);
        let account1Bid2 = await blindAuction.bids.call(accounts[1], 1);
        let account2Bid1 = await blindAuction.bids.call(accounts[2], 0);

        assert.equal(account1Bid1.blindedBid, firstBid)
        assert.equal(account1Bid2.blindedBid, secondBidFake)
        assert.equal(account2Bid1.blindedBid, winningBid)      
    })

    it("reveal will return all bids except for the totally highest", async() => {
        let valuesAccount1 = [10, 20]
        let fakesAccount1 = [false, true]
        let secretsAccount1 = [web3.utils.asciiToHex('first'), web3.utils.asciiToHex('second')]

        let valuesAccount2 = [15]
        let fakesAccount2 = [false]
        let secretsAccount2 = [web3.utils.asciiToHex('win')]

        function mine(durationSeconds) {
            return new Promise((resolve, reject) => {
                web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'evm_increaseTime',
                params: [durationSeconds],
                id: Date.now()
                }, (err, resp) => {
                if (err) {
                    return reject(err)
                }
    
                resolve()
                })
            })
        }

        mine(11000);

        await blindAuction.reveal(valuesAccount1, fakesAccount1, secretsAccount1, {
            from: accounts[1]
        })

        await blindAuction.reveal(valuesAccount2, fakesAccount2, secretsAccount2, {
            from: accounts[2]
        })

        let acutalHighestBidder = await blindAuction.highestBidder.call()

        assert.equal(acutalHighestBidder, highestBidder)
    })






})