import path from "path";
import { emulator, init, shallPass, shallResolve, shallRevert, getAccountAddress } from "flow-js-testing";

import { toUFix64, getRockPeaksAdminAddress } from "./src/common";
import {
  deployRockPeaksClipCard,
  setupRockPeaksClipCardOnAccount,
  getRockPeaksClipCardSupply,
  mintRockPeaksClipCard,
  transferRockPeaksClipCard,
  getRockPeaksClipCard,
  getRockPeaksClipCardCount,
} from "./src/clip-card";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(500000);

describe("rp-clip-card", ()=>{
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../cadence");
		// You can specify different port to parallelize execution of describe blocks
    const port = 8080;
		// Setting logging flag to true will pipe emulator output to console
    const logging = true;

    await init(basePath, { port });
    return emulator.start(port, logging);
  });

 // Stop emulator, so it could be restarted
  afterEach(async () => {
    return emulator.stop();
  });

  it("shall deploy RockPeaksClipCard contract", async () => {
    await deployRockPeaksClipCard();
  });

  it("supply shall be 0 after contract is deployed", async () => {
    // Setup
    await deployRockPeaksClipCard();
    const RockPeaksAdmin = await getRockPeaksAdminAddress();
    await shallPass(setupRockPeaksClipCardOnAccount(RockPeaksAdmin));

    await shallResolve(async () => {
      const supply = await getRockPeaksClipCardSupply();
      expect(supply).toBe(0);
    });
  });

  it("shall be able to mint a kittyItems", async () => {
    // Setup
    await deployRockPeaksClipCard();
    const Barnaby = await getAccountAddress("Barnaby");
    await setupRockPeaksClipCardOnAccount(Barnaby);
    const nodeIdToMint = '2c443592-cd3c-403a-81e5-ffa4608422c5';

    // Mint instruction for Barnaby account shall be resolved
    await shallPass(mintRockPeaksClipCard(nodeIdToMint, Barnaby));
  });

  it("shall be able to create a new empty NFT Collection", async () => {
    // Setup
    await deployRockPeaksClipCard();
    const Barnaby = await getAccountAddress("Barnaby");
    await setupRockPeaksClipCardOnAccount(Barnaby);

    // shall be able te read Barnaby collection and ensure it's empty
    await shallResolve(async () => {
      const itemCount = await getRockPeaksClipCardCount(Barnaby);
      expect(itemCount).toBe(0);
    });
  });

  it("shall not be able to withdraw an NFT that doesn't exist in a collection", async () => {
    // Setup
    await deployRockPeaksClipCard();
    const Barnaby = await getAccountAddress("Barnaby");
    const Bob = await getAccountAddress("Bob");
    await setupRockPeaksClipCardOnAccount(Barnaby);
    await setupRockPeaksClipCardOnAccount(Bob);

    // Transfer transaction shall fail for non-existent item
    await shallRevert(transferRockPeaksClipCard(Barnaby, Bob, 1337));
  });

  it("shall be able to withdraw an NFT and deposit to another accounts collection", async () => {
    await deployRockPeaksClipCard();
    const Barnaby = await getAccountAddress("Barnaby");
    const Bob = await getAccountAddress("Bob");
    await setupRockPeaksClipCardOnAccount(Barnaby);
    await setupRockPeaksClipCardOnAccount(Bob);

    // Mint instruction for Barnaby account shall be resolved
    await shallPass(mintRockPeaksClipCard('2c443592-cd3c-403a-81e5-ffa4608422c5', Barnaby));

    // Transfer transaction shall pass
    await shallPass(transferRockPeaksClipCard(Barnaby, Bob, 0));
  });
})
