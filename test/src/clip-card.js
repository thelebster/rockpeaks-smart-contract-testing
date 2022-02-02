import { deployContractByName, mintFlow, executeScript, sendTransaction } from "flow-js-testing";
import { getRockPeaksAdminAddress } from "./common";

/*
 * Deploys NonFungibleToken and RockPeaksClipCard contracts to RockPeaksAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deployRockPeaksClipCard = async () => {
  const RockPeaksAdmin = await getRockPeaksAdminAddress();
  await mintFlow(RockPeaksAdmin, "10.0");

  await deployContractByName({ to: RockPeaksAdmin, name: "NonFungibleToken" });

  const addressMap = { NonFungibleToken: RockPeaksAdmin };
  return deployContractByName({ to: RockPeaksAdmin, name: "RockPeaksClipCard", addressMap });
};

/*
 * Setups RockPeaksClipCard collection on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const setupRockPeaksClipCardOnAccount = async (account) => {
  const name = "clip-card/setup_account";
  const signers = [account];

  return sendTransaction({ name, signers });
};

/*
 * Returns RockPeaksClipCard supply.
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64} - number of NFT minted so far
 * */
export const getRockPeaksClipCardSupply = async () => {
  const name = "clip-card/get_supply";

  return executeScript({ name });
};

/*
 * Mints RockPeaksClipCard and sends it to **recipient**.
 * @param {string} nodeId - RockPeaks Clip Card entity UUID
 * @param {string} recipient - recipient account address
 * @throws Will throw an error if execution will be halted
 * @returns {Promise<*>}
 * */
export const mintRockPeaksClipCard = async (nodeId, recipient) => {
  const RockPeaksAdmin = await getRockPeaksAdminAddress();

  const name = "clip-card/mint_token";
  const args = [recipient, nodeId];
  const signers = [RockPeaksAdmin];

  return sendTransaction({ name, args, signers });
};

/*
 * Transfers RockPeaksClipCard NFT with id equal **itemId** from **sender** account to **recipient**.
 * @param {string} sender - sender address
 * @param {string} recipient - recipient address
 * @param {UInt64} itemId - id of the item to transfer
 * @throws Will throw an error if execution will be halted
 * @returns {Promise<*>}
 * */
export const transferRockPeaksClipCard = async (sender, recipient, itemId) => {
  const name = "clip-card/transfer_token";
  const args = [recipient, itemId];
  const signers = [sender];

  return sendTransaction({ name, args, signers });
};

/*
 * Returns the RockPeaksClipCard NFT with the provided **id** from an account collection.
 * @param {string} account - account address
 * @param {UInt64} itemID - NFT id
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getRockPeaksClipCard = async (account, itemID) => {
  const name = "clip-card/get_token";
  const args = [account, itemID];

  return executeScript({ name, args });
};

/*
 * Returns the number of RockPeaksClipCard NFTs in an account's collection.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getRockPeaksClipCardCount = async (account) => {
  const name = "clip-card/get_collection_length";
  const args = [account];

  return executeScript({ name, args });
};

/*
 * Returns the RockPeaksClipCard NFT metadata.
 * @param {string} account - account address
 * @param {UInt64} itemID - NFT id
 * @throws Will throw an error if execution will be halted
 * @returns {String: String}
 * */
export const getRockPeaksClipCardMetadata = async (account, itemID) => {
  const name = "clip-card/get_metadata";
  const args = [account, itemID];

  return executeScript({ name, args });
};
