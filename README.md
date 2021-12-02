# RockPeaks Smart Contracts for the Flow Network

This is a **complete NFT marketplace** built with [Cadence](https://docs.onflow.org/cadence), Flow's resource-oriented smart contract programming language.

## Flow Core Contracts Addresses

|Name|Testnet|Mainnet|
|----|-------|-------|
|[FungibleToken](./cadence/contracts/FungibleToken.cdc)|[0x9a0766d93b6608b7](https://flow-view-source.com/testnet/account/0x9a0766d93b6608b7/contract/FungibleToken)|[0xf233dcee88fe0abe](https://flowscan.org/contract/A.f233dcee88fe0abe.FungibleToken)|
|[NonFungibleToken](./cadence/contracts/NonFungibleToken.cdc)|[0x631e88ae7f1d7c20](https://flow-view-source.com/testnet/account/0x631e88ae7f1d7c20/contract/NonFungibleToken)|[0x1d7e57aa55817448](https://flowscan.org/contract/A.1d7e57aa55817448.NonFungibleToken)|
|[NFTStorefront](./cadence/contracts/NFTStorefront.cdc)|[0x94b06cfca1d8a476](https://flow-view-source.com/testnet/account/0x94b06cfca1d8a476/contract/NFTStorefront)|[0x4eb8a10cb9f87357](https://flowscan.org/contract/A.4eb8a10cb9f87357.NFTStorefront)|

* https://docs.onflow.org/core-contracts/fungible-token/
* https://docs.onflow.org/core-contracts/non-fungible-token/
* https://github.com/onflow/nft-storefront

## Flow Testnet

[Contracts](./cadence/contracts) has been deployed to the Flow testnet under the admin account [0x8441c7a9269d7eb8](https://flow-view-source.com/testnet/account/0x8441c7a9269d7eb8).

## Testing

Go to the [./test](./test) to find and run test suite.

## Deploy to testnet

Copy `.env.sample` to `.env` and specify necessary environmental variables.

```
./deploy.testnet.sh
```

## Create a testnet account

Generate a private key.

```
source .env && \
flow keys generate \
  --config-path flow.json \
  --output json
```

```
{
    "private": "e661b6cef4791978844db4c1ae603fb3f81c6d865...",
    "public": "3bffb91a3c1c4b11f72891fb614b78c2a6f84bbbfc..."
}
```

Create an account using a public key from the previous step.

```
source .env && \
flow accounts create \
	--key 3bffb91a3c1c4b11f72891fb614b78c2a6f84bbbfc... \
	--network testnet \
	--signer testnet-account
```

```
Transaction ID: e445b6b65c47a2e12022a7bf1b9c80b49bac1e73737afb29fcd237c243fec5b0

Address  0xb3bac6876b64addd
Balance  0.00100000
Keys     1

...
```

Go to the https://testnet-faucet-v2.onflow.org/fund-account to fund an account for a 1,000 Testnet FLOW tokens to be able to run transactions.

Setup an account to be able to use Peakons, use private key to sign a transaction.

```
FLOW_TESTNET_ACCOUNT_ADDRESS=0xb3bac6876b64addd \
FLOW_TESTNET_PRIVATE_KEY=e661b6cef4791978844db4c1ae603fb3f81c6d865... \
flow transactions send ./cadence/transactions/peakon/setup_account.cdc \
	--network testnet \
	--signer testnet-account
```

```
Transaction ID: 7195ca116ead6e410f5af3279d4e0f2c35bf62d71d2b9bbc05941730753b6598

Status          ✅ SEALED
ID              7195ca116ead6e410f5af3279d4e0f2c35bf62d71d2b9bbc05941730753b6598
Payer           b3bac6876b64addd
Authorizers     [b3bac6876b64addd]

...
```

Repeat the previous step to setup different capabilities to an account.
