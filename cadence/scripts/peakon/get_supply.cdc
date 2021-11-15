import Peakon from "../../contracts/Peakon.cdc"

// This script returns the total amount of Peakon currently in existence.
pub fun main(): UFix64 {
    let supply = Peakon.totalSupply
    log(supply)
    return supply
}
 