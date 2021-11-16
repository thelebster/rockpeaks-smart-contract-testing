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
