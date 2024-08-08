// src/nftContract.js

import Web3 from 'web3';
import ABI from './Blop9.json';

const CONTRACT_ADDRESS = "0x4982ac90C1cA9044633448B9b347B506F4ebb55a";

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const contract = new web3.eth.Contract(ABI.abi, CONTRACT_ADDRESS);

export const getMintedTokens = async () => {
  try {
    return await contract.methods.totalSupply().call();
  } catch (error) {
    console.error("Error in getMintedTokens:", error);
    throw error;
  }
};

export const getMintFee = async () => {
  try {
    return await contract.methods.fee().call();
  } catch (error) {
    console.error("Error in getMintFee:", error);
    throw error;
  }
};

export const getTokenDetails = async (tokenId) => {
  try {
    return await contract.methods.tokenURI(tokenId).call();
  } catch (error) {
    console.error("Error in getTokenDetails:", error);
    throw error;
  }
};

export const getTransactionHistory = async (account) => {
  try {
    const events = await contract.getPastEvents('Transfer', {
      filter: { from: account },
      fromBlock: 0,
      toBlock: 'latest',
    });
    return events;
  } catch (error) {
    console.error("Error in getTransactionHistory:", error);
    throw error;
  }
};
