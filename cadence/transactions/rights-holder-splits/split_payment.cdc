import FungibleToken from "./../../contracts/FungibleToken.cdc"
import Peakon from "./../../contracts/Peakon.cdc"
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
            if recipientRef.getCapability<&Peakon.Vault{FungibleToken.Receiver}>(Peakon.ReceiverPublicPath)!.check() {
                let recipientAddr = recipientRef.address.toString()
                if splits.containsKey(recipient) {
                    let splitAmount = splits[recipient]!
                    let split = RightsHolderSplits.PaymentSplit(
                        receiver: recipientRef.getCapability<&Peakon.Vault{FungibleToken.Receiver}>(Peakon.ReceiverPublicPath)!,
                        amount: splitAmount,
                        address: recipientRef.address
                    )
                    self.paymentSplits.append(split)
                }
            }
        }

        let vaultBalanceRef = signer.getCapability(Peakon.BalancePublicPath).borrow<&Peakon.Vault{FungibleToken.Balance}>()
            ?? panic("Could not borrow Balance reference to the Vault")

        // Check an actual payer balance
        assert(vaultBalanceRef.balance > amount, message: "Balance should be greater than amount to pay!")

        // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&Peakon.Vault>(from: Peakon.VaultStoragePath)
			?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.sentVault <- vaultRef.withdraw(amount: amount)

        self.residualReceiver = signer.getCapability(Peakon.ReceiverPublicPath)!.borrow<&{FungibleToken.Receiver}>()!
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
