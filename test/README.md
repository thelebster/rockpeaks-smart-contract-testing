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

npm test -- storefront.test.js

npm test -- nft-storefront.test.js

# Set logging flag to true to pipe emulator output to console
DEBUG=1 npm test -- storefront.test.js
```

## References

* [Testnet Testing Guidelines](https://docs.onflow.org/dapp-development/testnet-testing/)

## Changelog

**Nov 22, 2021**
* Switch to the [NFT storefront contract](https://github.com/onflow/nft-storefront), a general-purpose Cadence contract for trading NFTs on Flow.
