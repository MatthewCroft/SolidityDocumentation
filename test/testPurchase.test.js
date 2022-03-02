const Purchase = artifacts.require("Purchase");
const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

contract("Purchase", (accounts) => {
    let purchase;
    let buyer;
    let seller;

    before(async() => {
        seller = accounts[0];
        purchase = await Purchase.new({
            from: accounts[0],
            value: 10
        });
        buyer = accounts[1];
    }) 


    it("buyer is able to confimPurchase", async() => {
        let result = await purchase.confirmPurchase({
            from: accounts[1],
            value: 10
        });

        await expectEvent(
            result,
            "PurchasedConfirmed"
        )
    })

    it("onlyBuyer can confirmRecieved", async() => {

        // error caught for seller trying to confirm received
        await expectRevert.unspecified(purchase.confirmReceived({
            from: seller
        }));

        // buyer confirms he got product
        let result = await purchase.confirmReceived({
            from: buyer
        })

        await expectEvent(
            result,
            "ItemReceived"
        );
    })

    it("onlySeller can refundSeller", async() => {

        // buyer trys to refund, exception thrown
        await expectRevert.unspecified(purchase.refundSeller({
            from: buyer
        }))

        // seller collects funds
        let result = await purchase.refundSeller({
            from: seller
        })

        await expectEvent(
            result,
            "SellerRefunded"
        )
    })
});

contract("Purchase", (accounts) => {
    let purchase;
    let seller;

    before(async() => {
        seller = accounts[0];
        purchase = await Purchase.new({
            from: accounts[0],
            value: 10
        });
    })

    it("Seller is able to abort the contract", async() => {

        // buyer confirms he got product
        let result = await purchase.abort({
            from: seller
        })

        await expectEvent(
            result,
            "Aborted"
        );
    })
});