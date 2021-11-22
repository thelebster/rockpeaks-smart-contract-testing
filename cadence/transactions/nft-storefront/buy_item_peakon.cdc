import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Peakon from "../../contracts/Peakon.cdc"
import RockPeaksClipCard from "../../contracts/RockPeaksClipCard.cdc"
import NFTStorefront from "../../contracts/NFTStorefront.cdc"

transaction(listingResourceID: UInt64, storefrontAddress: Address) {

    let paymentVault: @FungibleToken.Vault
    let rockPeaksClipCardCollection: &RockPeaksClipCard.Collection{NonFungibleToken.Receiver}
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let saleOffer: &NFTStorefront.Listing{NFTStorefront.ListingPublic}

    prepare(account: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Cannot borrow Storefront from provided address")

        self.saleOffer = self.storefront.borrowListing(listingResourceID: listingResourceID)
            ?? panic("No offer with that ID in Storefront")

        let price = self.saleOffer.getDetails().salePrice

        let mainPeakonVault = account.borrow<&Peakon.Vault>(from: Peakon.VaultStoragePath)
            ?? panic("Cannot borrow Peakon vault from account storage")

        self.paymentVault <- mainPeakonVault.withdraw(amount: price)

        self.rockPeaksClipCardCollection = account.borrow<&RockPeaksClipCard.Collection{NonFungibleToken.Receiver}>(
            from: RockPeaksClipCard.CollectionStoragePath
        ) ?? panic("Cannot borrow RockPeaksClipCard collection receiver from account")
    }

    execute {
        let item <- self.saleOffer.purchase(
            payment: <-self.paymentVault
        )

        self.rockPeaksClipCardCollection.deposit(token: <-item)

        self.storefront.cleanup(listingResourceID: listingResourceID)
    }
}
