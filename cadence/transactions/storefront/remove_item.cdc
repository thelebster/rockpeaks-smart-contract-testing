// SPDX-License-Identifier: Unlicense
import RockPeaksClipCardMarket from "../../contracts/RockPeaksClipCardMarket.cdc"

transaction(itemID: UInt64) {
    let marketCollection: &RockPeaksClipCardMarket.Collection

    prepare(signer: AuthAccount) {
        self.marketCollection = signer.borrow<&RockPeaksClipCardMarket.Collection>(from: RockPeaksClipCardMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed RockPeaksClipCardMarket Collection")
    }

    execute {
        let offer <-self.marketCollection.remove(itemID: itemID)
        destroy offer
    }
}
