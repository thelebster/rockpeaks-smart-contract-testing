import FungibleToken from "../../contracts/FungibleToken.cdc"
import Peakon from "../../contracts/Peakon.cdc"

// This transaction is a template for a transaction
// to add a Vault resource to their account
// so that they can use the Peakons

transaction {

    prepare(signer: AuthAccount) {

        if signer.borrow<&Peakon.Vault>(from: Peakon.VaultStoragePath) == nil {
            // Create a new Peakon Vault and put it in storage
            signer.save(<-Peakon.createEmptyVault(), to: Peakon.VaultStoragePath)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            signer.link<&Peakon.Vault{FungibleToken.Receiver}>(
                Peakon.ReceiverPublicPath,
                target: Peakon.VaultStoragePath
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            signer.link<&Peakon.Vault{FungibleToken.Balance}>(
                Peakon.BalancePublicPath,
                target: Peakon.VaultStoragePath
            )
        }
    }
}
