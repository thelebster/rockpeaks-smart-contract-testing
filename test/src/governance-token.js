import { deployContractByName, mintFlow, executeScript, sendTransaction } from "flow-js-testing";
import { getRockPeaksAdminAddress } from "./common";

/*
 * Deploys NonFungibleToken and GovernanceToken contracts to RockPeaksAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deployGovernanceToken = async () => {
  const RockPeaksAdmin = await getRockPeaksAdminAddress();
  await mintFlow(RockPeaksAdmin, "10.0");

  await deployContractByName({ to: RockPeaksAdmin, name: "NonFungibleToken" });

  const addressMap = { NonFungibleToken: RockPeaksAdmin };
  return deployContractByName({ to: RockPeaksAdmin, name: "GovernanceToken", addressMap });
};

/*
 * Setups GovernanceToken collection on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const setupGovernanceTokenOnAccount = async (account) => {
  const name = "governance-token/setup_account";
  const signers = [account];

  return sendTransaction({ name, signers });
};

/*
 * Returns GovernanceToken supply.
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64} - number of NFT minted so far
 * */
export const getGovernanceTokenSupply = async () => {
  const name = "governance-token/get_supply";

  return executeScript({ name });
};

/*
 * Mints GovernanceToken and sends it to **recipient**.
 * @param {string} userID - RockPeaks User entity UUID
 * @param {string} recipient - recipient account address
 * @throws Will throw an error if execution will be halted
 * @returns {Promise<*>}
 * */
export const mintGovernanceToken = async (userID, recipient) => {
  const RockPeaksAdmin = await getRockPeaksAdminAddress();

  const name = "governance-token/mint_token";
  const args = [recipient, userID];
  const signers = [RockPeaksAdmin];

  return sendTransaction({ name, args, signers });
};

/*
 * Transfers GovernanceToken NFT with id equal **itemId** from **sender** account to **recipient**.
 * @param {string} sender - sender address
 * @param {string} recipient - recipient address
 * @param {UInt64} itemId - id of the item to transfer
 * @throws Will throw an error if execution will be halted
 * @returns {Promise<*>}
 * */
export const transferGovernanceToken = async (sender, recipient, itemId) => {
  const name = "governance-token/transfer_token";
  const args = [recipient, itemId];
  const signers = [sender];

  return sendTransaction({ name, args, signers });
};

/*
 * Returns the GovernanceToken NFT with the provided **id** from an account collection.
 * @param {string} account - account address
 * @param {UInt64} itemID - NFT id
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getGovernanceToken = async (account, itemID) => {
  const name = "governance-token/get_token";
  const args = [account, itemID];

  return executeScript({ name, args });
};

/*
 * Returns the number of GovernanceToken NFTs in an account's collection.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getGovernanceTokenCount = async (account) => {
  const name = "governance-token/get_collection_length";
  const args = [account];

  return executeScript({ name, args });
};
