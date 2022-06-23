import FungibleToken from "./../../contracts/FungibleToken.cdc"
import FUSD from "./../../contracts/FUSD.cdc"
import RightsHolderSplits from "../../contracts/RightsHolderSplits.cdc"

transaction(amount: UFix64, recipients: [Address], splits: {Address: UFix64}, nftID: UInt64) {
    let paymentSplits: [RightsHolderSplits.PaymentSplit]

    // The Vault resource that holds the tokens that are being transferred
    let sentVault: @FungibleToken.Vault

    let residualReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.paymentSplits = []

        for recipient in recipients {
            let recipientRef = getAccount(recipient)
            if recipientRef.getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver)!.check() {
                let recipientAddr = recipientRef.address.toString()
                if splits.containsKey(recipient) {
                    let splitAmount = splits[recipient]!
                    let split = RightsHolderSplits.PaymentSplit(
                        receiver: recipientRef.getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver)!,
                        amount: splitAmount,
                        address: recipientRef.address
                    )
                    self.paymentSplits.append(split)
                }
            }
        }

        let vaultBalanceRef = signer.getCapability(/public/fusdBalance)!.borrow<&FUSD.Vault{FungibleToken.Balance}>()
            ?? panic("Could not borrow Balance reference to the FUSD Vault")

        // Check an actual payer balance
        assert(vaultBalanceRef.balance > amount, message: "Balance should be greater than amount to pay!")

        // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)
            ?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.sentVault <- vaultRef.withdraw(amount: amount)

        self.residualReceiver = signer.getCapability(/public/fusdReceiver)!.borrow<&{FungibleToken.Receiver}>()!
    }

    execute {
        RightsHolderSplits.execute(
            payment: <-self.sentVault,
            nftID: nftID,
            residualReceiver: self.residualReceiver,
            slipts: self.paymentSplits
        )
    }
}
