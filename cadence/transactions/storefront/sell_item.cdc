// SPDX-License-Identifier: Unlicense
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import RockPeaksClipCard from "../../contracts/RockPeaksClipCard.cdc"
import FungibleToken from "./../../contracts/FungibleToken.cdc"
import Peakon from "./../../contracts/Peakon.cdc"
import RockPeaksClipCardMarket from "../../contracts/RockPeaksClipCardMarket.cdc"

transaction(itemID: UInt64, price: UFix64) {
    let peakonVault: Capability<&Peakon.Vault{FungibleToken.Receiver}>
    let rockPeaksClipCardCollection: Capability<&RockPeaksClipCard.Collection{NonFungibleToken.Provider, RockPeaksClipCard.RockPeaksClipCardCollectionPublic}>
    let marketCollection: &RockPeaksClipCardMarket.Collection

    prepare(signer: AuthAccount) {
        // we need a provider capability, but one is not provided by default so we create one.
        let RockPeaksClipCardCollectionProviderPrivatePath = /private/RockPeaksClipCardCollectionProvider

        self.peakonVault = signer.getCapability<&Peakon.Vault{FungibleToken.Receiver}>(Peakon.ReceiverPublicPath)!
        assert(self.peakonVault.borrow() != nil, message: "Missing or mis-typed Peakon receiver")

        if !signer.getCapability<&RockPeaksClipCard.Collection{NonFungibleToken.Provider, RockPeaksClipCard.RockPeaksClipCardCollectionPublic}>(RockPeaksClipCardCollectionProviderPrivatePath)!.check() {
            signer.link<&RockPeaksClipCard.Collection{NonFungibleToken.Provider, RockPeaksClipCard.RockPeaksClipCardCollectionPublic}>(RockPeaksClipCardCollectionProviderPrivatePath, target: RockPeaksClipCard.CollectionStoragePath)
        }

        self.rockPeaksClipCardCollection = signer.getCapability<&RockPeaksClipCard.Collection{NonFungibleToken.Provider, RockPeaksClipCard.RockPeaksClipCardCollectionPublic}>(RockPeaksClipCardCollectionProviderPrivatePath)!
        assert(self.rockPeaksClipCardCollection.borrow() != nil, message: "Missing or mis-typed RockPeaksClipCardCollection provider")

        self.marketCollection = signer.borrow<&RockPeaksClipCardMarket.Collection>(from: RockPeaksClipCardMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed RockPeaksClipCardMarket Collection")
    }

    execute {
        let offer <- RockPeaksClipCardMarket.createSaleOffer (
            sellerItemProvider: self.rockPeaksClipCardCollection,
            itemID: itemID,
            nodeID: self.rockPeaksClipCardCollection.borrow()!.borrowRockPeaksClipCard(id: itemID)!.nodeId,
            sellerPaymentReceiver: self.peakonVault,
            price: price
        )
        self.marketCollection.insert(offer: <-offer)
    }
}
