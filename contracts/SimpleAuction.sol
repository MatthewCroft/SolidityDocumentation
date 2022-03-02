// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract SimpleAuction {
    // Parameters of the auction. Times are either
    // absolute unix timstamps (seconds since 1970-01-01)
    // or time periods in seconds
    address payable public beneficiary;
    uint public auctionEndTime;

    // Current state of teh auction
    address public highestBidder;
    uint public highestBid;

    // Allowed withdrawls of previous bids
    mapping(address => uint) pendingReturns;

    // Set to true at the end, disallows any change.
    // By default initialized to `false`.
    bool ended;

    // Events that will be emitted on changes
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    // Erros that described failures

    // The triple-slash comments are so-called natspec
    // comments. They will be shown when the user
    // is asked to confirm a transaction or
    // when an error is displayed.

    /// The auction has already ended
    error AuctionAlreadyEnded();
    /// There is already a higher or equal bid.
    error BidNotHighEnough(uint highestBid);
    /// The auction has not ended yet.
    error AuctionNotYetEnded();
    /// The function auctionEnd has already been called.
    error AuctionEndAlreadyCalled();

    /// Create a simple auction with `biddingTime`.
    /// seconds bidding time on behalf of the 
    /// beneficiary address `beneficiaryAddress`.
    constructor(
        uint biddingTime,
        address payable beneficiaryAddress
    ) {
        beneficiary = beneficiaryAddress;
        auctionEndTime = block.timestamp + biddingTime;
    }

    /// Bid on the auction with the value sent
    /// together with this transaction
    /// the value will only be refunded if the
    /// auction is not won
    function bid() external payable {
        // No arguments are necessary, all
        // information is already part of 
        // the transaction. The keyword payable
        // is required for the function to 
        // be able to receive Ether

        // Revert the call if the bidding
        // period is over.
        if (block.timestamp > auctionEndTime)
            revert AuctionAlreadyEnded();

        // If the bid is not higher, send the 
        // money back (the revert statement
        // will revert all changes in this
        // function execution including
        // it having recieved the money).
        if (msg.value <= highestBid) 
            revert BidNotHighEnough(highestBid);

        if (highestBid != 0) {
            // Sending back the money by simply using
            // highestBidder.send(highestBid) is a security risk
            // because it could execute an untrusted contract.
            // It is always safer to let the recipients
            // withdraw their money themselves
            pendingReturns[highestBidder] += highestBid;
        }
        // update the new highestBidder
        highestBidder = msg.sender;
        highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    /// Withdraw a bid that was overbid.
    function withdraw() external returns (bool) {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            // It is important to se this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `send` returns.
            pendingReturns[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                // No need to call throw here, just reset the amount owing
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    /// End the auction and send the highest bid
    /// to the beneficiary.
    function auctionEnd() external {
        // It is good guideline to structure functions that interact
        // with other contracts (i.e. they call function or send Ether)
        // into three pahses:
        // 1. checking condidtions 
        // 2. performing actions (potentially changing conditions)
        // 3. interacting with other contracts
        // If these phases are mixed up, the other contract could call
        // back into the current contacts and modify the state or cause 
        // effects (ether payout) to be performed multiple times.
        // If functions called internally include interaction with external
        // contracts, they also have to be considered interaction with
        // external contacts.

        // 1. Conditions 
        if (block.timestamp < auctionEndTime)
            revert AuctionNotYetEnded();
        if (ended) 
            revert AuctionEndAlreadyCalled();
        
        // 2. Effects
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        // 3. Interaction
        beneficiary.transfer(highestBid);
    }


}