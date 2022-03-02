# Web3 Learnings

Learnings from going through Solidity documentation examples. Tests and simple front ends were built for each of the contract examples

## Tools used

[Solidity](https://docs.soliditylang.org/en/v0.8.12/)

[Ganache](https://trufflesuite.com/ganache/)

[Truffle](https://trufflesuite.com/truffle/)

[web3js](https://web3js.readthedocs.io/en/v1.7.0/)

[React](https://reactjs.org/)

[MetaMask](https://metamask.io/)

## Installation
Clone this repository locally

Install truffle 
```bash
npm install truffle -g
```

Download [Ganache](https://trufflesuite.com/ganache/)

## Run App Quickstart
1. Quickstart Ganache Ethereum blockchain
2. Inside Repo directory run 
    ```bash
    truffle compile
    ```
    to compile the smart contracts
3. Next run
    ```bash
    truffle migrate
    ```
    this will deploy the smart contracts to the Ganache local blockchain
4. cd to the /client directory and run
    ```
    npm run start
    ```
    this will deploy the FE of the application to localhost:3000
5. Setup Metamask with Ganache accounts to send ether and work with the contracts/app. Learn how to setup Metamask with Ganache [here](https://trufflesuite.com/docs/truffle/getting-started/truffle-with-metamask.html#setting-up-metamask)

## Overview

1. **Simple Auction**
![Imgur](https://i.imgur.com/K5NYxu1.png)

    A Simple Auction allows users to
    * **Bid**: Use to place bids, will only place a bid if it is the new highest bid. All bids value are in Ether
    * **Withdraw**: Allows previous highest bidders who are now outbid to get their funds back
    * **End Auction**: Any user is allowed to complete the auction after 

2. **Blind Auction**


3. **Safe Remote Purchase**
![Imgur](https://i.imgur.com/elLPmHN.png)

    This Safe Remote Purchase contract locks twice the value of the item from the buyer. From there the contract can
    * **Confirm Purchase**: Sends twice the value of the item to the contract and sets the caller as the buyer
    * **Confirm Recieved**: After Recieving the item, the buyer executes this to recieve there other half of the locked away total. 
    * **Refund Seller**: After buyer has Confirm Received, seller can release the locked funds 
    and the value of the item
    * **Abort Sale**: If no buyer has Confirm Purchase then the seller has the option to abort contract 

## Testing with Metamask example

### Setting up MetaMask with Ganache

1. Add localhost network by clicking in the upper right hand corner and choosing **Add Network**  
![Imgur](https://i.imgur.com/LUNU1El.png)

2. Enter the following details listed below, the Ganache blockchain runs on **port 7545** and **Chain ID 1337** by default 
![Imgur](https://i.imgur.com/oRlM5ta.png)

3. Copy the **mnemonic** phrase from your local Ganache blockchain  
![Imgur](https://i.imgur.com/TKPxqQA.png)

4. Import the Ganache accounts with metamask using the mnemonic phrase copied in step 1 and choose a password and click restore
![Imgur](https://i.imgur.com/rXiSvZQ.png)

### Compile and Deploy Smart Contracts to Ganache

1. Inside Repo directory run 
    ```bash
    truffle compile
    ```
    to compile the smart contracts
2. Next run
    ```bash
    truffle migrate
    ```
    this will deploy the smart contracts to the Ganache local blockchain
3. cd to the /client directory and run
    ```
    npm run start
    ```
    this will deploy the FE of the application to localhost:3000

### Interacting with the App through MetaMask

1. Travel to [localhost:3000/auction](http://localhost:3000/auction)
    * Here you will be asked to connect a MetaMask account to the site, go ahead and pick the account you want and connect
    ![Imgur](https://i.imgur.com/grhk1rU.png) 

2. Next place a Bid by entering a number (make sure it is higher than the current Highest Bid) into the input box to the left of the Bid button and click bid. You will see a screen show up with the value you typed in the box and the Bid function being called in your MetaMask 
![Imgur](https://i.imgur.com/SKhHJ2s.png)

    After confirming the transaction you can see the highest bidder and bid update with the request you just made
    ![Imgur](https://i.imgur.com/GZGFUSY.png)


You now have setup MetaMask to your local blockchain, lauched smart contracts to that blockchain, and interacted with the smart contracts using MetaMask through the UI. You can use this understanding to interact with the other apps in this repository