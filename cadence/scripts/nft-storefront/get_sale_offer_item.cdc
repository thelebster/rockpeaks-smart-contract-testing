import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import NFTStorefront from "../../contracts/NFTStorefront.cdc"
import RockPeaksClipCard from "../../contracts/RockPeaksClipCard.cdc"

pub struct SaleItem {
    pub let itemID: UInt64
    pub let nodeID: String
    pub let owner: Address
    pub let price: UFix64

    init(itemID: UInt64, nodeID: String, owner: Address, price: UFix64) {
        self.itemID = itemID
        self.nodeID = nodeID
        self.owner = owner
        self.price = price
    }
}

pub fun main(address: Address, listingResourceID: UInt64): SaleItem? {
    let account = getAccount(address)

    if let storefrontRef = account.getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath).borrow() {
        if let saleOffer = storefrontRef.borrowListing(listingResourceID: listingResourceID) {
            let details = saleOffer.getDetails()

            let itemID = details.nftID
            let itemPrice = details.salePrice

            if let collection = account.getCapability<&RockPeaksClipCard.Collection{NonFungibleToken.CollectionPublic, RockPeaksClipCard.RockPeaksClipCardCollectionPublic}>(RockPeaksClipCard.CollectionPublicPath).borrow() {
                if let item = collection.borrowRockPeaksClipCard(id: itemID) {
                    return SaleItem(itemID: itemID, nodeID: item.nodeId, owner: address, price: itemPrice)
                }
            }
        }
    }
        
    return nil
}
