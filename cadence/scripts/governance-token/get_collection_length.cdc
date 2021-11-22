// SPDX-License-Identifier: Unlicense
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import GovernanceToken from "../../contracts/GovernanceToken.cdc"

// This script returns the size of an account's GovernanceToken NFTs collection.

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account.getCapability(GovernanceToken.CollectionPublicPath)!
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    return collectionRef.getIDs().length
}
