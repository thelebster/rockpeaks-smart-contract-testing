import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import RockPeaksClipCard from "../../contracts/RockPeaksClipCard.cdc"

// This transaction configures an account to hold RockPeaksClipCard Items.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&RockPeaksClipCard.Collection>(from: RockPeaksClipCard.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- RockPeaksClipCard.createEmptyCollection()

            // save it to the account
            signer.save(<-collection, to: RockPeaksClipCard.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&RockPeaksClipCard.Collection{NonFungibleToken.CollectionPublic, RockPeaksClipCard.RockPeaksClipCardCollectionPublic}>(RockPeaksClipCard.CollectionPublicPath, target: RockPeaksClipCard.CollectionStoragePath)
        }
    }
}
