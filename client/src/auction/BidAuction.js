import React from "react";
import { useForm } from "react-hook-form";

function BidAuction(props) {
    const { register, handleSubmit } = useForm();

    const onSubmit = async(data) => {
        try {
            console.error(props.contract);
            props.contract.methods.bid().send({ from: props.accounts[0], value: props.web3.utils.toWei(data.bid, "ether") });
            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
          } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
              `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
          }
          props.highestBidIncreased()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("bid")}/>
            <input type="submit" value="Bid" />
        </form>
    )
    
}

export default BidAuction;