import path from "path";
import { emulator, init, shallPass, shallResolve, shallRevert, getAccountAddress } from "flow-js-testing";

import { toUFix64, getRockPeaksAdminAddress } from "./src/common";
import {
  deployGovernanceToken,
  setupGovernanceTokenOnAccount,
  getGovernanceToken,
  mintGovernanceToken,
  transferGovernanceToken,
  getGovernanceTokenCount,
  getGovernanceTokenSupply,
} from "./src/governance-token";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(500000);

describe("governance-token", ()=>{
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

  it("shall deploy GovernanceToken contract", async () => {
    await deployGovernanceToken();
  });

  it("supply shall be 0 after contract is deployed", async () => {
    // Setup
    await deployGovernanceToken();
    const RockPeaksAdmin = await getRockPeaksAdminAddress();
    await shallPass(setupGovernanceTokenOnAccount(RockPeaksAdmin));

    const [supply] = await shallResolve(getGovernanceTokenSupply());
    expect(supply).toBe(0);
  });

  it("shall be able to mint a GovernanceToken", async () => {
    // Setup
    await deployGovernanceToken();
    const Barnaby = await getAccountAddress("Barnaby");
    await setupGovernanceTokenOnAccount(Barnaby);
    const userIdToMint = 'e0b931a6-840b-4dc0-b712-e29542292e6a';

    // Mint instruction for Barnaby account shall be resolved
    await shallPass(mintGovernanceToken(userIdToMint, Barnaby));
  });

  it("shall be able to create a new empty NFT Collection", async () => {
    // Setup
    await deployGovernanceToken();
    const Barnaby = await getAccountAddress("Barnaby");
    await setupGovernanceTokenOnAccount(Barnaby);

    // shall be able te read Barnaby collection and ensure it's empty
    const [itemCount] = await shallResolve(getGovernanceTokenCount(Barnaby));
    expect(itemCount).toBe(0);
  });

  it("shall not be able to withdraw an NFT that doesn't exist in a collection", async () => {
    // Setup
    await deployGovernanceToken();
    const Barnaby = await getAccountAddress("Barnaby");
    const Bob = await getAccountAddress("Bob");
    await setupGovernanceTokenOnAccount(Barnaby);
    await setupGovernanceTokenOnAccount(Bob);

    // Transfer transaction shall fail for non-existent item
    await shallRevert(transferGovernanceToken(Barnaby, Bob, 1337));
  });

  it("shall be able to withdraw an NFT and deposit to another accounts collection", async () => {
    await deployGovernanceToken();
    const Barnaby = await getAccountAddress("Barnaby");
    const Bob = await getAccountAddress("Bob");
    await setupGovernanceTokenOnAccount(Barnaby);
    await setupGovernanceTokenOnAccount(Bob);

    // Mint instruction for Barnaby account shall be resolved
    await shallPass(mintGovernanceToken('2c443592-cd3c-403a-81e5-ffa4608422c5', Barnaby));

    // Transfer transaction shall pass
    await shallPass(transferGovernanceToken(Barnaby, Bob, 0));
  });
})
