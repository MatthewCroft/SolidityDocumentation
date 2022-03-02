const SimpleAuction = artifacts.require("SimpleAuction");
const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');


contract("SimpleAuction", (accounts) => {
    let simpleAuction;

    before(async () => {
        simpleAuction = await SimpleAuction.new(1000, accounts[7]);
    });

    describe("A simple auction that should run for a period of time and pay to a beneficiary", async () => {
        
        it("Highest Bid Increased", async () => {      
            let firstBid = await simpleAuction.bid({
                from: accounts[1],
                value: 10
            });

            await expectEvent(
                firstBid,
                "HighestBidIncreased",
                { 
                    bidder: accounts[1],
                    amount: new BN('10')
                }
            );
        });

        it("Bid too Low", async () => {
            await expectRevert.unspecified(
                simpleAuction.bid({
                    from: accounts[2],
                    value: 5 
                })
            );
        });

        it("Time has ended for the auction, no more bids are allowed", async () => {

            await simpleAuction.bid({
                from: accounts[3],
                value: 20
            })

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

            await mine(5000);

            await expectRevert.unspecified(
                simpleAuction.bid({
                    from: accounts[2],
                    value: 50
                })
            );
        });

        it("End the Auction, beneficiary recieved funds", async () => {
            
            let result = await simpleAuction.auctionEnd();

            await expectEvent(
                result,
                "AuctionEnded",
                {
                    winner: accounts[3],
                    amount: new BN('20')
                }
            );
        });


    });
})