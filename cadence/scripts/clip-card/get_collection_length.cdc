// SPDX-License-Identifier: Unlicense
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import RockPeaksClipCard from "../../contracts/RockPeaksClipCard.cdc"

// This script returns the size of an account's RockPeaksClipCard NFTs collection.

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account.getCapability(RockPeaksClipCard.CollectionPublicPath)!
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    return collectionRef.getIDs().length
}
