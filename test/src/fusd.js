import { deployContractByName, mintFlow, executeScript, sendTransaction } from "flow-js-testing";
import { getRockPeaksAdminAddress } from "./common";

/*
 * Deploys FUSD contract to RockPeaksAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deployFUSD = async () => {
  const RockPeaksAdmin = await getRockPeaksAdminAddress();
  await mintFlow(RockPeaksAdmin, "10.0");

  return deployContractByName({ to: RockPeaksAdmin, name: "FUSD" });
};

/*
 * Setups FUSD Vault on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const setupFUSDOnAccount = async (account) => {
  const name = "FUSD/setup_fusd_vault";
  const signers = [account];

  return sendTransaction({ name, signers });
};

/*
 * Mints **amount** of FUSD tokens and transfers them to recipient.
 * @param {string} recipient - recipient address
 * @param {string} amount - UFix64 amount to mint
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const mintFUSD = async (recipient, amount) => {
  const RockPeaksAdmin = await getRockPeaksAdminAddress();

  const name = "FUSD/mint_tokens";
  const args = [recipient, amount];
  const signers = [RockPeaksAdmin];

  return sendTransaction({ name, args, signers });
};

/*
 * Returns FUSD balance for **account**.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UFix64}
 * */
export const getFUSDBalance = async (account) => {
  const name = "FUSD/get_balance";
  const args = [account];

  return executeScript({ name, args });
};
