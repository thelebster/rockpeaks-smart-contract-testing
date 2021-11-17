import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import RockPeaksClipCard from "../../contracts/RockPeaksClipCard.cdc"
import FungibleToken from "./../../contracts/FungibleToken.cdc"
import Peakon from "./../../contracts/Peakon.cdc"
import RockPeaksClipCardMarket from "../../contracts/RockPeaksClipCardMarket.cdc"

transaction(itemID: UInt64, marketCollectionAddress: Address) {
    let paymentVault: @FungibleToken.Vault
    let itemsCollection: &RockPeaksClipCard.Collection{NonFungibleToken.Receiver}
    let marketCollection: &RockPeaksClipCardMarket.Collection{RockPeaksClipCardMarket.CollectionPublic}
    let escrowVault: @FungibleToken.Vault

    prepare(acct: AuthAccount) {
        self.marketCollection = getAccount(marketCollectionAddress)
            .getCapability<&RockPeaksClipCardMarket.Collection{RockPeaksClipCardMarket.CollectionPublic}>(RockPeaksClipCardMarket.CollectionPublicPath)
            .borrow() ?? panic("Could not borrow market collection from market address")

        let price = self.marketCollection.borrowSaleItem(itemID: itemID)!.price

        let mainPeakonVault = acct.borrow<&Peakon.Vault>(from: Peakon.VaultStoragePath)
            ?? panic("Cannot borrow Peakon vault from acct storage")
        self.paymentVault <- mainPeakonVault.withdraw(amount: price - (price * 0.1))

        self.itemsCollection = acct.borrow<&RockPeaksClipCard.Collection{NonFungibleToken.Receiver}>(
            from: RockPeaksClipCard.CollectionStoragePath
        ) ?? panic("Cannot borrow RockPeaksClipCard collection receiver from acct")

        // Withdraw tokens from the signer's stored vault
        self.escrowVault <- mainPeakonVault.withdraw(amount: price * 0.1)
    }

    execute {
        self.marketCollection.purchase(
            itemID: itemID,
            buyerCollection: self.itemsCollection,
            buyerPayment: <- self.paymentVault
        )

        // Get the escrow's public account object
        let recipient = getAccount(0xEscrowAccount)

        // Get a reference to the recipient's Receiver
        let receiverRef = recipient.getCapability(Peakon.ReceiverPublicPath)!.borrow<&{FungibleToken.Receiver}>()
          ?? panic("Could not borrow receiver reference to the recipient's Vault")

        // Deposit the withdrawn tokens in the recipient's receiver
        receiverRef.deposit(from: <-self.escrowVault)
    }
}
