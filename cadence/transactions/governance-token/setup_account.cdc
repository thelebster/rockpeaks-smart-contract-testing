// SPDX-License-Identifier: Unlicense
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import GovernanceToken from "../../contracts/GovernanceToken.cdc"

// This transaction configures an account to hold GovernanceToken Items.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&GovernanceToken.Collection>(from: GovernanceToken.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- GovernanceToken.createEmptyCollection()

            // save it to the account
            signer.save(<-collection, to: GovernanceToken.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&GovernanceToken.Collection{NonFungibleToken.CollectionPublic, GovernanceToken.GovernanceTokenCollectionPublic}>(GovernanceToken.CollectionPublicPath, target: GovernanceToken.CollectionStoragePath)
        }
    }
}
