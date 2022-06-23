import path from "path";
import { emulator, init, getAccountAddress, shallPass, set, getConfigValue, shallRevert, shallResolve } from "flow-js-testing";

import { toUFix64 } from "./src/common";
import { mintPeakon, setupPeakonOnAccount, getPeakonBalance } from "./src/peakon";
import { setupFUSDOnAccount, mintFUSD, getFUSDBalance } from "./src/fusd";
import {
  deployRightsHolderSplits,
  splitPayment,
  splitPaymentFUSD,
} from "./src/rights-holder-splits";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(500000);

describe("rights-holder-splits", () => {
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../cadence");
    // You can specify different port to parallelize execution of describe blocks
    const port = 8080;
    // Setting logging flag to true will pipe emulator output to console
    const logging = process.env.DEBUG || false;

    await init(basePath, { port });
    await emulator.start(port, logging);
  });

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    await emulator.stop();
  });

  it("shall deploy RightsHolderSplits contract", async () => {
    await shallPass(deployRightsHolderSplits());
  });

  it("shall be able to create a peakon payment split", async () => {
    // Setup
    await deployRightsHolderSplits();
    const Barnaby = await getAccountAddress("Barnaby");
    await setupPeakonOnAccount(Barnaby);

    await shallPass(mintPeakon(Barnaby, toUFix64(100)));

    const RPAccount = await getAccountAddress("RPAccount");
    await setupPeakonOnAccount(RPAccount);

    const YTAccount = await getAccountAddress("YTAccount");
    await setupPeakonOnAccount(YTAccount);

    const SellerAccount = await getAccountAddress("SellerAccount");
    await setupPeakonOnAccount(SellerAccount);

    const amount = 15.0;
    const recipients = [RPAccount, YTAccount, SellerAccount];
    let splits = {};
    splits[RPAccount] = toUFix64(5.0);
    splits[YTAccount] = toUFix64(3.0);
    splits[SellerAccount] = toUFix64(7.0);

    const nftID = 0;
    const transactionResult = await shallPass(splitPayment(Barnaby, toUFix64(amount), recipients, splits, nftID));

    const [RPBalance] = await getPeakonBalance(RPAccount);
    expect(RPBalance).toBe(toUFix64(5));

    const [YTBalance] = await getPeakonBalance(YTAccount);
    expect(YTBalance).toBe(toUFix64(3));

    const [SellerBalance] = await getPeakonBalance(SellerAccount);
    expect(SellerBalance).toBe(toUFix64(7));

    const [barnBalance] = await getPeakonBalance(Barnaby);
    expect(barnBalance).toBe(toUFix64(85));
  });

  it("shall not be able to create a payment split if balance lower than amount to pay", async () => {
    // Setup
    await deployRightsHolderSplits();
    const Barnaby = await getAccountAddress("Barnaby");
    await setupPeakonOnAccount(Barnaby);

    await shallPass(mintPeakon(Barnaby, toUFix64(10)));

    const RPAccount = await getAccountAddress("RPAccount");
    await setupPeakonOnAccount(RPAccount);

    const YTAccount = await getAccountAddress("RPAccount");
    await setupPeakonOnAccount(YTAccount);

    const recipients = [RPAccount, YTAccount];
    let splits = {};
    splits[RPAccount] = toUFix64(15.0);
    splits[YTAccount] = toUFix64(10.0);

    const nftID = 0;
    await shallRevert(splitPayment(Barnaby, toUFix64(25.0), recipients, splits, nftID));

    // Balances shall be intact
    const [barnBalance] = await shallResolve(getPeakonBalance(Barnaby));
    expect(barnBalance).toBe(toUFix64(10));

    const [RPAccountBalance] = await shallResolve(getPeakonBalance(RPAccount));
    expect(RPAccountBalance).toBe(toUFix64(0));

    const [YTAccountBalance] = await shallResolve(getPeakonBalance(YTAccount));
    expect(YTAccountBalance).toBe(toUFix64(0));
  });

  it("shall be able to create a FUSD payment split", async () => {
    // Setup
    await deployRightsHolderSplits();
    const Barnaby = await getAccountAddress("Barnaby");
    await setupFUSDOnAccount(Barnaby);

    await shallPass(mintFUSD(Barnaby, toUFix64(20)));

    const RPAccount = await getAccountAddress("RPAccount");
    await setupFUSDOnAccount(RPAccount);

    const YTAccount = await getAccountAddress("YTAccount");
    await setupFUSDOnAccount(YTAccount);

    const SellerAccount = await getAccountAddress("SellerAccount");
    await setupFUSDOnAccount(SellerAccount);

    const amount = 15.0;
    const recipients = [RPAccount, YTAccount, SellerAccount];
    let splits = {};
    splits[RPAccount] = toUFix64(5.0);
    splits[YTAccount] = toUFix64(3.0);
    splits[SellerAccount] = toUFix64(7.0);

    const nftID = 0;
    const transactionResult = await shallPass(splitPaymentFUSD(Barnaby, toUFix64(amount), recipients, splits, nftID));

    const [RPBalance] = await getFUSDBalance(RPAccount);
    expect(RPBalance).toBe(toUFix64(5));

    const [YTBalance] = await getFUSDBalance(YTAccount);
    expect(YTBalance).toBe(toUFix64(3));

    const [SellerBalance] = await getFUSDBalance(SellerAccount);
    expect(SellerBalance).toBe(toUFix64(7));

    const [barnBalance] = await getFUSDBalance(Barnaby);
    expect(barnBalance).toBe(toUFix64(5));
  });
});
