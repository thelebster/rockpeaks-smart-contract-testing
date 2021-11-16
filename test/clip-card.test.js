import path from "path";
import { emulator, init, shallPass, shallResolve, shallRevert, getAccountAddress } from "flow-js-testing";

import { toUFix64, getRockPeaksAdminAddress } from "./src/common";
import {
  deployRockPeaksClipCard,
  setupRockPeaksClipCardOnAccount,
  getRockPeaksClipCardSupply,
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
})
