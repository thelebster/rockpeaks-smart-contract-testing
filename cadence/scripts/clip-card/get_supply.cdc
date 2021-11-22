// SPDX-License-Identifier: Unlicense
import RockPeaksClipCard from "../../contracts/RockPeaksClipCard.cdc"

// This scripts returns the number of RockPeaksClipCard currently in existence.

pub fun main(): UInt64 {
    return RockPeaksClipCard.totalSupply
}
