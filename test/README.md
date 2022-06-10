# RockPeaks Test Suite

Tests here were created with the [JS Testing Framework](https://github.com/onflow/flow-js-testing).

## Run tests

```shell
npm install

npm run test

# Run a single test by name
npm test -- -t "rp-clip-card"

# Run a single test file
npm test -- peakon.test.js

npm test -- clip-card.test.js

npm test -- governance-token.test.js

npm test -- nft-storefront.test.js

npm test -- rights-holder-splits.test.js

# Set logging flag to true to pipe emulator output to console
npm test -- nft-storefront.test.js
```

## References

* [Testnet Testing Guidelines](https://docs.onflow.org/dapp-development/testnet-testing/)

## Changelog

**June 10, 2022**
* Update [flow-js-testing](https://github.com/onflow/flow-js-testing) version to 0.2.3-alpha.5 due to [issue](https://github.com/onflow/flow-js-testing/issues/94) to make it compatible with the latest flow emulator version. 

**Nov 24, 2021**
* Add basic contract [./RightsHolderSplits.cdc](../cadence/contracts/RightsHolderSplits.cdc) to process payment splits.

**Nov 22, 2021**
* Switch to the [NFT storefront contract](https://github.com/onflow/nft-storefront), a general-purpose Cadence contract for trading NFTs on Flow.
