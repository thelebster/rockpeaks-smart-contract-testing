import GovernanceToken from "../../contracts/GovernanceToken.cdc"

// This scripts returns the number of GovernanceToken currently in existence.

pub fun main(): UInt64 {
    return GovernanceToken.totalSupply
}
