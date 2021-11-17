### Run tests

```
cd test

npm install

npm run test

# Run a single test by name
npm test -- -t "rp-clip-card"

# Run a single test file
npm test -- peakon.test.js

npm test -- clip-card.test.js

npm test -- governance-token.test.js

npm test -- storefront.test.js

# Set logging flag to true to pipe emulator output to console
DEBUG=1 npm test -- storefront.test.js
```

* [Testnet Testing Guidelines](https://docs.onflow.org/dapp-development/testnet-testing/)
* [JavaScript Testing Framework for Flow Network](https://github.com/onflow/flow-js-testing)
