import path from "path";
import { emulator, init, getAccountAddress, shallPass, set, getConfigValue } from "flow-js-testing";
import * as fcl from "@onflow/fcl";

import {getRockPeaksAdminAddress, toUFix64} from "./src/common";
import { mintPeakon } from "./src/peakon";
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
} from "./src/storefront";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(500000);

describe("storefront", () => {
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../cadence");
    // You can specify different port to parallelize execution of describe blocks
    const port = 8080;
    // Setting logging flag to true will pipe emulator output to console
    const logging = false;

    await init(basePath, { port });
    return emulator.start(port, logging);
  });

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    return emulator.stop();
  });

  it("shall deploy Storefront (RockPeaksClipCardMarket) contract", async () => {
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

    // Mint KittyItem for Barnaby's account
    await shallPass(mintRockPeaksClipCard('2c443592-cd3c-403a-81e5-ffa4608422c5', Barnaby));

    const itemID = 0;

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

    // Bob shall be able to buy from Barnaby
    const sellItemTransactionResult = await shallPass(sellItem(Barnaby, itemId, toUFix64(1.11)));

    const saleOfferAvailableEvent = sellItemTransactionResult.events[0];
    const saleOfferResourceID = saleOfferAvailableEvent.data.itemID;

    // Setup escrow account
    const Escrow = await getAccountAddress('Escrow');
    await setupStorefrontOnAccount(Escrow);
    fcl.config().put("0xEscrowAccount", Escrow);

    await shallPass(buyItem(Bob, saleOfferResourceID, Barnaby));

    const itemCount = await getRockPeaksClipCardCount(Bob);
    expect(itemCount).toBe(1);

    const RockPeaksAdmin = await getRockPeaksAdminAddress();
    const offerCount = await getSaleOfferCount(RockPeaksAdmin, Barnaby);
    expect(offerCount).toBe(0);
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

    // Listing item for sale shall pass
    const sellItemTransactionResult = await shallPass(sellItem(Barnaby, itemId, toUFix64(1.11)));

    const saleOfferAvailableEvent = sellItemTransactionResult.events[0];
    const saleOfferResourceID = saleOfferAvailableEvent.data.itemID;

    // Barnaby shall be able to remove item from sale
    await shallPass(removeItem(Barnaby, saleOfferResourceID));

    const RockPeaksAdmin = await getRockPeaksAdminAddress();
    const offerCount = await getSaleOfferCount(RockPeaksAdmin, Barnaby);
    expect(offerCount).toBe(0);
  });
});
