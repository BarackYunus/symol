import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, WalletContractV4, Address } from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";
import { Cell, beginCell } from "@ton/core";

let client;

export const initTonClient = async () => {
  if (!client) {
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    client = new TonClient({ endpoint });
  }
  return client;
};

export const createWallet = async (mnemonic) => {
  const client = await initTonClient();
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  return {
    address: wallet.address,
    contract: wallet,
  };
};

export const getBalance = async (address) => {
  const client = await initTonClient();
  return await client.getBalance(address);
};

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const sendTransaction = async (from, to, amount, message = "") => {
  const client = await initTonClient();
  
  // Create message body
  const messageBody = beginCell()
    .storeUint(4, 32)  // op::buy operation
    .storeUint(parseInt(message.split(" ")[2]), 32)  // tweet_id
    .endCell();

  // Create transfer
  const transfer = {
    to: Address.parse(CONTRACT_ADDRESS),
    value: amount,
    body: messageBody,
  };

  try {
    // Send the transaction
    const result = await client.sendTransaction(transfer);
    return result.hash;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
};

// New functions to interact with the smart contract
export const mintTweet = async (content, wallet) => {
  const messageBody = beginCell()
    .storeUint(1, 32)  // op::mint
    .storeString(content)
    .endCell();

  const transfer = {
    to: Address.parse(CONTRACT_ADDRESS),
    value: "0.1", // Gas fees
    body: messageBody,
  };

  return await wallet.send(transfer);
};

export const listTweetForSale = async (tweetId, price, wallet) => {
  const messageBody = beginCell()
    .storeUint(3, 32)  // op::list_for_sale
    .storeUint(tweetId, 32)
    .storeCoins(price)
    .endCell();

  const transfer = {
    to: Address.parse(CONTRACT_ADDRESS),
    value: "0.1", // Gas fees
    body: messageBody,
  };

  return await wallet.send(transfer);
};

export const transferTweet = async (tweetId, toAddress, wallet) => {
  const messageBody = beginCell()
    .storeUint(2, 32)  // op::transfer
    .storeUint(tweetId, 32)
    .storeAddress(Address.parse(toAddress))
    .endCell();

  const transfer = {
    to: Address.parse(CONTRACT_ADDRESS),
    value: "0.1", // Gas fees
    body: messageBody,
  };

  return await wallet.send(transfer);
}; 