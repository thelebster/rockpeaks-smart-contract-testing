// SPDX-License-Identifier: Unlicense
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import RockPeaksClipCard from "../../contracts/RockPeaksClipCard.cdc"

pub struct AccountItem {
  pub let itemID: UInt64
  pub let nodeID: String
  pub let resourceID: UInt64
  pub let owner: Address

  init(itemID: UInt64, nodeID: String, resourceID: UInt64, owner: Address) {
    self.itemID = itemID
    self.nodeID = nodeID
    self.resourceID = resourceID
    self.owner = owner
  }
}

pub fun main(address: Address, itemID: UInt64): AccountItem? {
  if let collection = getAccount(address).getCapability<&RockPeaksClipCard.Collection{NonFungibleToken.CollectionPublic, RockPeaksClipCard.RockPeaksClipCardCollectionPublic}>(RockPeaksClipCard.CollectionPublicPath).borrow() {
    if let item = collection.borrowRockPeaksClipCard(id: itemID) {
      return AccountItem(itemID: itemID, nodeID: item.nodeId, resourceID: item.uuid, owner: address)
    }
  }

  return nil
}
