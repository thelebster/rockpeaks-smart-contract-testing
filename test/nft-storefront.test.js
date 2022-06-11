import path from "path";
import { emulator, init, getAccountAddress, shallPass, set, getConfigValue } from "flow-js-testing";
import * as fcl from "@onflow/fcl";

import { getRockPeaksAdminAddress, toUFix64 } from "./src/common";
import { mintPeakon, getPeakonBalance } from "./src/peakon";
import {
  getRockPeaksClipCardCount,
  mintRockPeaksClipCard,
  getRockPeaksClipCard,
} from "./src/clip-card";
import {
  deployNFTStorefront,
  setupStorefrontOnAccount,
  sellItem,
  buyItem,
  removeItem,
  getSaleOfferCount,
} from "./src/nft-storefront";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(500000);

describe("nft-storefront", () => {
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../cadence");
    // You can specify different port to parallelize execution of describe blocks
    const port = 8080;
    // Setting logging flag to true will pipe emulator output to console
    const logging = process.env.DEBUG || false;

    await init(basePath, { port });
    return emulator.start(port, logging);
  });

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    return emulator.stop();
  });

  it("shall deploy NFTStorefront contract", async () => {
    await shallPass(deployNFTStorefront());
  });

  it("shall be able to create an empty Storefront", async () => {
    // Setup
    await deployNFTStorefront();
    const Barnaby = await getAccountAddress("Barnaby");

    await shallPass(setupStorefrontOnAccount(Barnaby));
  });

  it("shall be able to create a sale offer", async () => {
    // Setup
    await deployNFTStorefront();
    const Barnaby = await getAccountAddress("Barnaby");
    await setupStorefrontOnAccount(Barnaby);

    // Mint RockPeaksClipCard for Barnaby's account
    await shallPass(mintRockPeaksClipCard('2c443592-cd3c-403a-81e5-ffa4608422c5', Barnaby));

    const itemID = 0;

    // Setup escrow account
    const Escrow = await getAccountAddress('Escrow');
    await setupStorefrontOnAccount(Escrow);
    fcl.config().put("0xEscrowAccount", Escrow);

    await shallPass(sellItem(Barnaby, itemID, toUFix64(1.11)));
  });

  it("shall be able to accept a sale offer", async () => {
    // Setup
    await deployNFTStorefront();

    // Setup seller account
    const Barnaby = await getAccountAddress("Barnaby");
    await setupStorefrontOnAccount(Barnaby);
    await mintRockPeaksClipCard('2c443592-cd3c-403a-81e5-ffa4608422c5', Barnaby)

    const itemId = 0;

    // Setup buyer account
    const Bob = await getAccountAddress("Bob");
    await setupStorefrontOnAccount(Bob);

    await shallPass(mintPeakon(Bob, toUFix64(100)));

    // Setup escrow account
    const Escrow = await getAccountAddress('Escrow');
    await setupStorefrontOnAccount(Escrow);
    fcl.config().put("0xEscrowAccount", Escrow);

    // Bob shall be able to buy from Barnaby
    const salePrice = 15.0;
    const sellItemTransactionResult = await shallPass(sellItem(Barnaby, itemId, toUFix64(salePrice)));

    const saleOfferAvailableEvent = sellItemTransactionResult.events[0];
    const saleOfferResourceID = saleOfferAvailableEvent.data.listingResourceID;

    await shallPass(buyItem(Bob, saleOfferResourceID, Barnaby));

    const itemCount = await getRockPeaksClipCardCount(Bob);
    expect(itemCount).toBe(1);

    const offerCount = await getSaleOfferCount(Barnaby);
    expect(offerCount).toBe(0);

    const commission = salePrice * 0.1; // 10%
    const barnabyBalance = await getPeakonBalance(Barnaby);
    expect(barnabyBalance).toBe(toUFix64(salePrice - commission));

    const bobBalance = await getPeakonBalance(Bob);
    expect(bobBalance).toBe(toUFix64(100 - salePrice));

    // Escrow balance should get a 10% commission from the original price
    const escrowBalance = await getPeakonBalance(Escrow);
    expect(escrowBalance).toBe(toUFix64(commission));
  });

  it("shall be able to remove a sale offer", async () => {
    // Deploy contracts
    await shallPass(deployNFTStorefront());

    // Setup Barnaby account
    const Barnaby = await getAccountAddress("Barnaby");
    await shallPass(setupStorefrontOnAccount(Barnaby));

    // Mint instruction shall pass
    await shallPass(mintRockPeaksClipCard('2c443592-cd3c-403a-81e5-ffa4608422c5', Barnaby));

    const itemId = 0;

    const item = await getRockPeaksClipCard(Barnaby, itemId);

    // Setup escrow account
    const Escrow = await getAccountAddress('Escrow');
    await setupStorefrontOnAccount(Escrow);
    fcl.config().put("0xEscrowAccount", Escrow);

    // Listing item for sale shall pass
    const sellItemTransactionResult = await shallPass(sellItem(Barnaby, itemId, toUFix64(1.11)));

    const saleOfferAvailableEvent = sellItemTransactionResult.events[0];
    const saleOfferResourceID = saleOfferAvailableEvent.data.listingResourceID;

    // Barnaby shall be able to remove item from sale
    await shallPass(removeItem(Barnaby, saleOfferResourceID));

    const offerCount = await getSaleOfferCount(Barnaby);
    expect(offerCount).toBe(0);
  });
});
