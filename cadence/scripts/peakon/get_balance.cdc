// SPDX-License-Identifier: Unlicense
import FungibleToken from "./../../contracts/FungibleToken.cdc"
import Peakon from "./../../contracts/Peakon.cdc"

// This script returns an account's Peakon balance.
pub fun main(address: Address): UFix64 {
    let account = getAccount(address)

    let vaultRef = account.getCapability(Peakon.BalancePublicPath)
        .borrow<&Peakon.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
