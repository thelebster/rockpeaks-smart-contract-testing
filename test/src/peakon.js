import { deployContractByName, mintFlow, executeScript, sendTransaction } from "flow-js-testing";
import { getRockPeaksAdminAddress } from "./common";

/*
 * Deploys Peakon contract to RockPeaksAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deployPeakon = async () => {
  const RockPeaksAdmin = await getRockPeaksAdminAddress();
  await mintFlow(RockPeaksAdmin, "10.0");

  return deployContractByName({ to: RockPeaksAdmin, name: "Peakon" });
};

/*
 * Returns Peakon supply.
 * @throws Will throw an error if execution will be halted
 * @returns {UFix64}
 * */
export const getPeakonSupply = async () => {
  const name = "peakon/get_supply";
  return executeScript({ name });
};

/*
 * Setups Peakon Vault on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const setupPeakonOnAccount = async (account) => {
  const name = "peakon/setup_account";
  const signers = [account];

  return sendTransaction({ name, signers });
};

/*
 * Returns Peakon balance for **account**.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UFix64}
 * */
export const getPeakonBalance = async (account) => {
  const name = "peakon/get_balance";
  const args = [account];

  return executeScript({ name, args });
};
