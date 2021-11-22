// SPDX-License-Identifier: Unlicense
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import RockPeaksClipCard from "../../contracts/RockPeaksClipCard.cdc"

// This transaction transfers a RockPeaksClipCard NFT from one account to another.

transaction(recipient: Address, withdrawID: UInt64) {
    prepare(signer: AuthAccount) {

        // get the recipients public account object
        let recipient = getAccount(recipient)

        // borrow a reference to the signer's NFT collection
        let collectionRef = signer.borrow<&RockPeaksClipCard.Collection>(from: RockPeaksClipCard.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        // borrow a public reference to the receivers collection
        let depositRef = recipient.getCapability(RockPeaksClipCard.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()!

        // withdraw the NFT from the owner's collection
        let nft <- collectionRef.withdraw(withdrawID: withdrawID)

        // Deposit the NFT in the recipient's collection
        depositRef.deposit(token: <-nft)
    }
}
