import { deployContractByName, executeScript, sendTransaction, set, getAccountAddress } from "flow-js-testing";
import { getRockPeaksAdminAddress } from "./common";
import { deployPeakon } from "./peakon";
import { deployFUSD } from "./fusd";

/*
 * Deploys Peakon and RightsHolderSplits contracts to RockPeaksAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deployRightsHolderSplits = async () => {
  const RockPeaksAdmin = await getRockPeaksAdminAddress();

  await deployPeakon();
  await deployFUSD();

  const addressMap = {
    Peakon: RockPeaksAdmin,
  };

  return deployContractByName({ to: RockPeaksAdmin, name: "RightsHolderSplits", addressMap });
};

/*
 * Split a payment between several account.
 * @param {string} payer - payer account address
 * @param {UInt64} nftID - id of nft item
 * @param {UFix64} amount - amount
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const splitPayment = async (payer, amount, recipients, splits, nftID) => {
  const name = "rights-holder-splits/split_payment";
  const args = [amount, recipients, splits, nftID];
  const signers = [payer];

  return sendTransaction({ name, args, signers });
};

/*
 * Split a payment between several account.
 * @param {string} payer - payer account address
 * @param {UInt64} nftID - id of nft item
 * @param {UFix64} amount - amount
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const splitPaymentFUSD = async (payer, amount, recipients, splits, nftID) => {
  const name = "rights-holder-splits/split_payment_fusd";
  const args = [amount, recipients, splits, nftID];
  const signers = [payer];

  return sendTransaction({ name, args, signers });
};
