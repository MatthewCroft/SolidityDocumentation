import React, {Component} from "react";
import BlindAuction from "../contracts/BlindAuction.json"
import getWeb3 from "../getWeb3";
import moment from 'moment'

class BlindBidAuction extends Component {

    state = { beneficiary: null, biddingEnd: null, revealEnd: null, ended: null }

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
      
            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
      
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = BlindAuction.networks[networkId];
            const contract = new web3.eth.Contract(
              SimpleAuctionContract.abi,
              deployedNetwork && deployedNetwork.address,
            );

            const biddingEndUnix = await contract.methods.biddingEnd().call();
            const revealEndUnix = await contract.methods.revealEnd().call();

            const biddingEnd = moment.unix(biddingEndUnix).calendar();
            const revealEnd = moment.unix(revealEndUnix).calendar();

            this.setState({ web3, accounts, contract, biddingEnd, revealEnd }, this.checkHighestBidIncreased);

        } catch (error) {
                // Catch any errors for any of the above operations.
                alert(
                  `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
        }
    };




    

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return(
            <div className="App">
                <h1>Blind Auction</h1>
                <p>
                    In a Blind Auction everyone can place bids that are either `real` or `fake`. This is done
                    by sending an encrypted message along with your bid to the contract. After the bidding time 
                    ends ({this.state.biddingEnd}) you are able to reveal your bids to see if you are the highest
                    bidder as well as returning any/all other bids you sent that where not the highest. If you
                    are outbid, you can use the withdraw button below to get your previous highest placed bid back.
                </p>
                
            </div>
        );
    }
    

}