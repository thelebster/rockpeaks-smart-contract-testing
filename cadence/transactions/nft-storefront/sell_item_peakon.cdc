import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Peakon from "../../contracts/Peakon.cdc"
import RockPeaksClipCard from "../../contracts/RockPeaksClipCard.cdc"
import NFTStorefront from "../../contracts/NFTStorefront.cdc"

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

    let peakonReceiver: Capability<&Peakon.Vault{FungibleToken.Receiver}>
    let rockPeaksClipCardProvider: Capability<&RockPeaksClipCard.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront

    prepare(account: AuthAccount) {
        // We need a provider capability, but one is not provided by default so we create one if needed.
        let rockPeaksClipCardCollectionProviderPrivatePath = /private/rockPeaksClipCardCollectionProvider

        self.peakonReceiver = account.getCapability<&Peakon.Vault{FungibleToken.Receiver}>(Peakon.ReceiverPublicPath)!

        assert(self.peakonReceiver.borrow() != nil, message: "Missing or mis-typed Peakon receiver")

        if !account.getCapability<&RockPeaksClipCard.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(rockPeaksClipCardCollectionProviderPrivatePath)!.check() {
            account.link<&RockPeaksClipCard.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(rockPeaksClipCardCollectionProviderPrivatePath, target: RockPeaksClipCard.CollectionStoragePath)
        }

        self.rockPeaksClipCardProvider = account.getCapability<&RockPeaksClipCard.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(rockPeaksClipCardCollectionProviderPrivatePath)!
        assert(self.rockPeaksClipCardProvider.borrow() != nil, message: "Missing or mis-typed RockPeaksClipCard.Collection provider")

        self.storefront = account.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")
    }

    execute {
        let saleCut = NFTStorefront.SaleCut(
            receiver: self.peakonReceiver,
            amount: saleItemPrice
        )
        self.storefront.createListing(
            nftProviderCapability: self.rockPeaksClipCardProvider,
            nftType: Type<@RockPeaksClipCard.NFT>(),
            nftID: saleItemID,
            salePaymentVaultType: Type<@Peakon.Vault>(),
            saleCuts: [saleCut]
        )
    }
}
