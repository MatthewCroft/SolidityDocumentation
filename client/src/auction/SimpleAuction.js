import React, { Component } from "react";
import SimpleAuctionContract from "../contracts/SimpleAuction.json";
import getWeb3 from "../getWeb3";
import BidAuction from "./BidAuction";
import moment from 'moment'

class SimpleAuction extends Component {

    state = { web3: null, accounts: null, contract: null, highestBidder: null, highestBid: null, auctionEndTime: null };

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
      
            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
      
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = SimpleAuctionContract.networks[networkId];
            const contract = new web3.eth.Contract(
              SimpleAuctionContract.abi,
              deployedNetwork && deployedNetwork.address,
            );

            const highestBidder = await contract.methods.highestBidder().call();
            const highestBid = await web3.utils.fromWei(await contract.methods.highestBid().call(), "ether");
            const auctionEndTimeUnix = await contract.methods.auctionEndTime().call();

            const auctionEndTime = moment.unix(auctionEndTimeUnix).calendar(); 

            this.setState({ web3, accounts, contract, highestBidder, highestBid, auctionEndTime }, this.checkHighestBidIncreased);

        } catch (error) {
                // Catch any errors for any of the above operations.
                alert(
                  `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
        }
    };

    checkHighestBidIncreased = async () => {
        const contract = this.state.contract;
        const web3 = this.state.web3;

        contract.events.HighestBidIncreased({}, (error, event) => { 
            var bid = web3.utils.fromWei(event.returnValues['amount'], "ether");
            this.setState({ highestBid:  bid, highestBidder: event.returnValues['bidder']});
        })
        .on('data', function(event) {
            console.log(event)
        })
      }

      withdraw = async () => {
        const contract = this.state.contract;
        const web3 = this.state.web3;

        try {

          const account = await web3.eth.getAccounts();

          contract.methods.withdraw().send({ from:  account[0] });
        } catch(error) {
          console.log(error);
        }
      }


      endAuction = async () => {
        const contract = this.state.contract;
        const web3 = this.state.web3;

        try {
            
          const account = await web3.eth.getAccounts();

          contract.methods.auctionEnd().send({ from: account[0] });

        } catch (error) {
          console.log(error);
        }

      }

      

      render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
          <div className="App">
            <h1>A Simple Auction</h1>
            <p>Place a bid on a contract by clicking the "bid" button below</p>
            <BidAuction 
                contract={this.state.contract}
                accounts={this.state.accounts} 
                web3={this.state.web3}
                highestBidIncreased={this.checkHighestBidIncreased}/>
            <p>
                Current Highest Bidder: {this.state.highestBidder}
            </p>
            <p>
                Highest Bid amount: {this.state.highestBid} Ether
            </p>

            <p>
                Auction End Time: {this.state.auctionEndTime}
            </p>

            <p> 
                If you are not the highest bidder, you are able to withdraw your previous
                bids by clicking withdraw.
            </p>
            <button onClick={this.withdraw}>
                Withdraw
            </button>

            <p>
              Click button below to end the Auction
            </p>
            <button onClick={this.endAuction}>
              End Auction
            </button>
          </div>
        );
      }


}

export default SimpleAuction;