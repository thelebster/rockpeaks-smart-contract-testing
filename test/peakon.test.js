import path from "path";
import { emulator, init, shallPass, shallResolve, shallRevert, getAccountAddress } from "flow-js-testing";

import { toUFix64, getRockPeaksAdminAddress } from "./src/common";
import {
  deployPeakon,
  getPeakonSupply,
  setupPeakonOnAccount,
  getPeakonBalance,
  mintPeakon,
  transferPeakon,
} from "./src/peakon";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(500000);

describe("peakon", ()=>{
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

  it("shall not be able to mint zero tokens", async () => {
    // Setup
    await deployPeakon();
    const Barnaby = await getAccountAddress("Barnaby");
    await setupPeakonOnAccount(Barnaby);

    // Mint instruction with amount equal to 0 shall be reverted
    await shallRevert(mintPeakon(Barnaby, toUFix64(0)));
  });

  it("shall mint tokens, deposit, and update balance and total supply", async () => {
    // Setup
    await deployPeakon();
    const Barnaby = await getAccountAddress("Barnaby");
    await setupPeakonOnAccount(Barnaby);
    const amount = toUFix64(50);

    // Mint Peakon tokens for Barnaby
    await shallPass(mintPeakon(Barnaby, amount));

    // Check Peakon total supply and Barnaby balance
    await shallResolve(async () => {
      // Check Barnaby balance to equal amount
      const balance = await getPeakonBalance(Barnaby);
      expect(balance).toBe(amount);

      // Check Peakon supply to equal amount
      const supply = await getPeakonSupply();
      expect(supply).toBe(amount);
    });
  });

  it("shall not be able to withdraw more than the balance of the Vault", async () => {
    // Setup
    await deployPeakon();
    const RockPeaksAdmin = await getRockPeaksAdminAddress();
    const Barnaby = await getAccountAddress("Barnaby");
    await setupPeakonOnAccount(RockPeaksAdmin);
    await setupPeakonOnAccount(Barnaby);

    // Set amounts
    const amount = toUFix64(1000);
    const overflowAmount = toUFix64(30000);

    // Mint instruction shall resolve
    await shallResolve(mintPeakon(RockPeaksAdmin, amount));

    // Transaction shall revert
    await shallRevert(transferPeakon(RockPeaksAdmin, Barnaby, overflowAmount));

    // Balances shall be intact
    await shallResolve(async () => {
      const barnBalance = await getPeakonBalance(Barnaby);
      expect(barnBalance).toBe(toUFix64(0));

      const RockPeaksAdminBalance = await getPeakonBalance(RockPeaksAdmin);
      expect(RockPeaksAdminBalance).toBe(amount);
    });
  });

  it("shall be able to withdraw and deposit tokens from a Vault", async () => {
    await deployPeakon();
    const RockPeaksAdmin = await getRockPeaksAdminAddress();
    const Barnaby = await getAccountAddress("Barnaby");
    await setupPeakonOnAccount(RockPeaksAdmin);
    await setupPeakonOnAccount(Barnaby);
    await mintPeakon(RockPeaksAdmin, toUFix64(1000));

    await shallPass(transferPeakon(RockPeaksAdmin, Barnaby, toUFix64(300)));

    await shallResolve(async () => {
      // Balances shall be updated
      const RockPeaksAdminBalance = await getPeakonBalance(RockPeaksAdmin);
      expect(RockPeaksAdminBalance).toBe(toUFix64(700));

      const barnBalance = await getPeakonBalance(Barnaby);
      expect(barnBalance).toBe(toUFix64(300));

      const supply = await getPeakonSupply();
      expect(supply).toBe(toUFix64(1000));
    });
  });
})
