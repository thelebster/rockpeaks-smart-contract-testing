import path from "path";
import { emulator, init, shallPass, shallResolve, getAccountAddress } from "flow-js-testing";

import { toUFix64, getRockPeaksAdminAddress } from "./src/common";
import {
  deployPeakon,
  getPeakonSupply,
  setupPeakonOnAccount,
  getPeakonBalance,
} from "./src/peakon";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000);

describe("Peakon", ()=>{
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

  it("shall have initialized supply field correctly", async () => {
    // Deploy contract
    await shallPass(deployPeakon());

    await shallResolve(async () => {
      const supply = await getPeakonSupply();
      expect(supply).toBe(toUFix64(0));
    });
  });

  it("shall be able to create empty Vault that doesn't affect supply", async () => {
    // Setup
    await deployPeakon();
    const Barnaby = await getAccountAddress("Barnaby");
    await shallPass(setupPeakonOnAccount(Barnaby));

    await shallResolve(async () => {
      const supply = await getPeakonSupply();
      const barnBalance = await getPeakonBalance(Barnaby);
      expect(supply).toBe(toUFix64(0));
      expect(barnBalance).toBe(toUFix64(0));
    });
  });
})
