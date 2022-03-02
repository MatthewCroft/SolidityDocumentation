import React, { Component } from "react";
import getWeb3 from "../getWeb3";
import Purchase from "../contracts/Purchase.json";

class SafePurchase extends Component {
    state = { web3: null, accounts: null, contract: null, value: null, total: null, buyer: null, seller: null };

    componentDidMount = async() => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
      
            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
      
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Purchase.networks[networkId];
            const contract = new web3.eth.Contract(
                Purchase.abi,
              deployedNetwork && deployedNetwork.address,
            );

            const seller = await contract.methods.seller().call();
            const buyer = await contract.methods.buyer().call();


            this.setState({ web3, accounts, contract, seller, buyer }, this.getTotal);

        } catch (error) {
                // Catch any errors for any of the above operations.
                alert(
                  `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
        }
    }

    getTotal = async () => {
        const { contract, web3 } = this.state;
        try {
            let totalWei = await contract.methods.total().call();
            let valueWei = await contract.methods.value().call();

            let total = web3.utils.fromWei(totalWei, "ether");
            let value = web3.utils.fromWei(valueWei, "ether");

            this.setState({ total: total, value: value});
        } catch (error) {
            console.log(error);
        }
        
    }
    
    confirmPurchase = async () => {
        const { total, accounts, contract, web3 } = this.state;

        try{
            await contract.methods.confirmPurchase().send({
                from: accounts[0],
                value: web3.utils.toWei(total, "ether") 
            })
            this.setState({ buyer: accounts[0] });
        } catch (error) {
            console.log(error);
        }
    }

    confirmReceived = async () => {
        const { accounts, contract } = this.state;

        await contract.methods.confirmReceived().send({
            from: accounts[0]
        });

        contract.events.ItemReceived({}, (error, event) => {
            console.log(event);
        });

    }

    refundSeller = async () => {
        const { contract, accounts } = this.state;

        await contract.methods.refundSeller().send({
            from: accounts[0]
        });

        contract.events.SellerRefunded({}, (error, event) => {
            console.log(event);
        });
    }

    abort = async () => {
        const { contract, accounts } = this.state;

        await contract.methods.abort().send({
            from: accounts[0]
        });

        contract.events.Aborted({}, (error, event) => {
            console.log(event); 
        })
    }

    render() {
        if (!this.state.web3 && !this.state.value) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div className="App">
                <h1>Safe Remote Purchase</h1>
                <h2>
                    Overview
                </h2>
                <p>
                    The seller of this contract is {this.state.seller}. The value of
                    the contract is {this.state.value} Ether, in order to confirm a Purchase
                    you must send twice the value (i.e. {this.state.total} Ether) to the contract, once
                    you recieve the item you and click Confirm Recieved you will recieve {this.state.value} Ether
                    back in your account. The seller ({this.state.seller}) has locked {this.state.total} Ether
                    in the contract to insure it is in their best benefit to send the item
                </p>

                <h3>
                    Seller: {this.state.seller}
                </h3>
                <h3>
                    Buyer: {this.state.buyer}
                </h3>

                <p>
                    If you wish to purchase the item please click Confirm Purchase
                </p>
                <button onClick={this.confirmPurchase}>
                    Confirm Purchase: {this.state.total} eth
                </button>
                <p>
                    If you are the buyer {this.state.buyer}, once you recieve
                    the item, click Confirm Received and you will receive the {this.state.value} Ether 
                    that was locked back into your account
                </p>
                <button onClick={this.confirmReceived}>
                    Confirm Received
                </button>
                <p>
                    Once the buyer recieved the item and Confirm Receieved you can
                    collect the {this.state.value} Ether of the item and your locked {this.state.total} Ether 
                    back into your account
                </p>
                <button onClick={this.refundSeller}>
                    Refund Seller
                </button>
                <p>
                    Seller {this.state.seller} if no buyer has Confirm Purchase then 
                    you are able to abort the contract
                </p>
                <button onClick={this.abort}>
                    Abort Sale
                </button>
            </div>
        )

    }
}

export default SafePurchase;