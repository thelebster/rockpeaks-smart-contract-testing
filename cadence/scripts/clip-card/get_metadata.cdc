// SPDX-License-Identifier: Unlicense
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import RockPeaksClipCard from "../../contracts/RockPeaksClipCard.cdc"

pub struct NFT {
  pub let type: String
  pub let uri: String

  init(type: String, uri: String) {
    self.type = type
    self.uri = uri
  }
}

pub fun main(address: Address, itemID: UInt64): NFT? {
  if let collection = getAccount(address).getCapability<&RockPeaksClipCard.Collection{NonFungibleToken.CollectionPublic, RockPeaksClipCard.RockPeaksClipCardCollectionPublic}>(RockPeaksClipCard.CollectionPublicPath).borrow() {
    if let item = collection.borrowRockPeaksClipCard(id: itemID) {
      let metadata = item.getMetadata()

      return NFT(
        type: metadata["type"]!,
        uri: metadata["uri"]!,
      )
    }
  }

  return nil
}
