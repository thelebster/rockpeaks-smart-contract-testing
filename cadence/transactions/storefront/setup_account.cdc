// SPDX-License-Identifier: Unlicense
import RockPeaksClipCardMarket from "../../contracts/RockPeaksClipCardMarket.cdc"

// This transaction configures an account to hold SaleOffer items.
transaction {
    prepare(signer: AuthAccount) {

        // if the account doesn't already have a collection
        if signer.borrow<&RockPeaksClipCardMarket.Collection>(from: RockPeaksClipCardMarket.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- RockPeaksClipCardMarket.createEmptyCollection() as! @RockPeaksClipCardMarket.Collection

            // save it to the account
            signer.save(<-collection, to: RockPeaksClipCardMarket.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&RockPeaksClipCardMarket.Collection{RockPeaksClipCardMarket.CollectionPublic}>(RockPeaksClipCardMarket.CollectionPublicPath, target: RockPeaksClipCardMarket.CollectionStoragePath)
        }
    }
}
